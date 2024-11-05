import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCommentDto } from './dto/createComment.dto.js';
import { PostService } from '../post/services/post.service.js';
import { UserService } from '../user/user.service.js';
import { UpdateCommentDto } from './dto/updateComment.dto.js';
import { FilterCommentsDto } from './dto/filterComment.dto.js';
import { Prisma } from '@prisma/client';
import { Comment } from './types/comment.type.js';
import { PaginatedResult } from 'src/common/types/paginatedResult.type.js';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  async findAll(filters: FilterCommentsDto): Promise<PaginatedResult<Comment>> {
    const where = this.getWhereClause(filters);
    const orderBy = this.getOrderByClause(filters);
    const { skip, take } = this.getPagination(filters);

    const [comments, totalDocs] = await Promise.all([
      await this.prismaService.comment.findMany({
        where,
        include: {
          comments: { include: { user: true, likes: true } },
          user: true,
          likes: true,
        },
        orderBy,
        skip,
        take,
      }),
      await this.prismaService.comment.count({ where }),
    ]);

    const commentsWithReplyCount = await Promise.all(
      comments.map(async (comment) => ({
        ...comment,
        replyCount: await this.getReplyCount(comment.id),
        comments: await Promise.all(
          comment.comments.map(async (reply) => ({
            ...reply,
            replyCount: await this.getReplyCount(reply.id),
          })),
        ),
      })),
    );

    return {
      data: commentsWithReplyCount,
      lastPage: Math.ceil(totalDocs / take),
    };
  }

  async create(userId: number, data: CreateCommentDto): Promise<Comment> {
    const post = await this.postService.findById(data.postId);
    if (!post) throw new BadRequestException('Статтю не знайдено!');

    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('Користувача не знайдено!');

    if (data.parentCommentId && !(await this.findById(data.parentCommentId)))
      throw new BadRequestException('Коментар не знайдено!');

    const doc = await this.prismaService.comment.create({ data: { ...data, userId } });

    return this.findById(doc.id);
  }

  async update(id: number, userId: number, data: UpdateCommentDto): Promise<Comment> {
    const comment = await this.findById(id);
    if (!comment) throw new BadRequestException('Коментар не знайдено!');

    if (comment.userId !== userId) throw new ForbiddenException('Ви не автор цього коментаря!');

    const doc = await this.prismaService.comment.update({ where: { id }, data });

    return this.findById(doc.id);
  }

  async delete(id: number, userId: number): Promise<void> {
    const comment = await this.findById(id);
    if (!comment) throw new BadRequestException('Коментар не знайдено!');

    if (comment.userId !== userId) throw new ForbiddenException('Ви не автор цього коментаря!');

    await this.prismaService.comment.delete({ where: { id } });
  }

  async findById(id: number): Promise<Comment> {
    const doc = await this.prismaService.comment.findUnique({
      where: { id },
      include: {
        comments: { include: { user: true, likes: true } },
        user: true,
        likes: true,
      },
    });

    if (!doc) throw new BadRequestException('Коментар не знайдено!');

    const docWithReplyCount = {
      ...doc,
      replyCount: await this.getReplyCount(doc.id),
      comments: await Promise.all(
        doc.comments.map(async (reply) => ({
          ...reply,
          replyCount: await this.getReplyCount(reply.id),
        })),
      ),
    };

    return docWithReplyCount;
  }

  async addlike(commentId: number, userId: number): Promise<Comment> {
    const comment = await this.findById(commentId);
    if (!comment) throw new BadRequestException('Коментар не знайдено!');

    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('Користувача не знайдено!');

    const isLiked = comment.likes.some((like) => like.userId === userId);

    if (!isLiked) await this.prismaService.commentLike.create({ data: { commentId, userId } });

    return await this.findById(commentId);
  }

  async removeLike(commentId: number, userId: number): Promise<Comment> {
    await this.prismaService.commentLike.deleteMany({ where: { commentId, userId } });

    return await this.findById(commentId);
  }

  private getWhereClause(payload: FilterCommentsDto): Prisma.CommentWhereInput {
    const where: Prisma.CommentWhereInput = {
      postId: payload.postId,
      userId: payload.userId,
      parentCommentId: payload.parentCommentId || null,
    };

    return where;
  }

  private getOrderByClause(payload: FilterCommentsDto): Prisma.CommentOrderByWithRelationInput {
    return { [payload.orderBy || 'createdAt']: payload.orderMode || 'asc' };
  }

  private getPagination(payload: FilterCommentsDto): { skip: number; take: number } {
    const page = payload.page || 1;
    const limit = payload.limit || 5;

    const skip = (page - 1) * limit;

    return { skip, take: limit };
  }

  private async getReplyCount(commentId: number): Promise<number> {
    return this.prismaService.comment.count({ where: { parentCommentId: commentId } });
  }
}
