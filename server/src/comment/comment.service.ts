import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateCommentDto } from './dto/createComment.dto.js';
import { PostService } from '../post/post.service.js';
import { UserService } from '../user/user.service.js';
import { UpdateCommentDto } from './dto/updateComment.dto.js';
import { FilterCommentsDto } from './dto/filterComment.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class CommentService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly postService: PostService,
    private readonly userService: UserService,
  ) {}

  async findAll(filters: FilterCommentsDto) {
    const where = this.getWhereClause(filters);
    const orderBy = this.getOrderByClause(filters);
    const { skip, take } = this.getPagination(filters);

    const [comments, totalDocs] = await Promise.all([
      await this.prismaService.comment.findMany({
        where,
        include: { comments: { include: { user: true } }, user: true },
        orderBy,
        skip,
        take,
      }),
      await this.prismaService.comment.count({ where }),
    ]);

    const commentsWithReplyCount = await Promise.all(
      comments.map(async (comment) => {
        const repliesWithCount = await Promise.all(
          comment.comments.map(async (reply) => {
            const replyCount = await this.prismaService.comment.count({
              where: { parentCommentId: reply.id },
            });

            return { ...reply, replyCount };
          }),
        );

        return { ...comment, comments: repliesWithCount };
      }),
    );

    return {
      data: commentsWithReplyCount,
      currentPage: filters.page,
      lastPage: Math.ceil(totalDocs / take),
    };
  }

  async create(userId: number, data: CreateCommentDto) {
    const post = await this.postService.findById(data.postId);
    if (!post) throw new BadRequestException('Статтю не знайдено!');

    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('Користувача не знайдено!');

    if (data.parentCommentId && !(await this.findById(data.parentCommentId)))
      throw new BadRequestException('Коментар не знайдено!');

    return this.prismaService.comment.create({ data: { ...data, userId } });
  }

  async update(id: number, userId: number, data: UpdateCommentDto) {
    const comment = await this.findById(id);
    if (!comment) throw new BadRequestException('Коментар не знайдено!');

    if (comment.userId !== userId) throw new ForbiddenException('Ви не автор цього коментаря!');

    return this.prismaService.comment.update({ where: { id }, data });
  }

  async delete(id: number, userId: number) {
    const comment = await this.findById(id);
    if (!comment) throw new BadRequestException('Коментар не знайдено!');

    if (comment.userId !== userId) throw new ForbiddenException('Ви не автор цього коментаря!');

    return this.prismaService.comment.delete({ where: { id } });
  }

  async findById(id: number) {
    return this.prismaService.comment.findUnique({ where: { id } });
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
}
