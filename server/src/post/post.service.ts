import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { FilterPostsDto } from './dto/filterPosts.dto.js';
import { DeviceDto } from '../common/dto/device.dto.js';
import { UserService } from '../user/user.service.js';
import { PaginatedResult } from 'src/common/types/paginatedResult.type.js';
import { Post } from './types/Post.type.js';

@Injectable()
export class PostService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
  ) {}

  async findAll(payload: FilterPostsDto): Promise<PaginatedResult<Post>> {
    const where = this.getWhereClause(payload);
    const orderBy = this.getOrderByClause(payload);
    const { skip, take } = this.getPagination(payload);

    const [posts, totalDocs] = await Promise.all([
      this.prisma.post.findMany({
        where,
        include: {
          topics: { include: { topic: true } },
          views: true,
          likes: true,
        },
        orderBy,
        skip,
        take,
      }),
      this.countDocs(where),
    ]);

    return {
      data: posts,
      lastPage: Math.ceil(totalDocs / take),
    };
  }

  async findById(id: number): Promise<Post> {
    return await this.prisma.post.findUnique({
      where: { id },
      include: {
        topics: { include: { topic: true } },
        views: true,
        likes: true,
      },
    });
  }

  async findBySlug(slug: string): Promise<Post> {
    return await this.prisma.post.findFirst({
      where: { slug },
      include: {
        topics: { include: { topic: true } },
        views: true,
        likes: true,
      },
    });
  }

  async addView(postId: number, device: DeviceDto): Promise<Post> {
    const { ip, userAgent } = device;
    const post = await this.prisma.post.findUnique({ where: { id: postId }, include: { views: true } });
    if (!post) return;

    const isViewed = post.views.some((view) => view.ip === ip && view.userAgent === userAgent);
    if (isViewed) return;

    await this.prisma.view.create({ data: { postId, ip, userAgent } });

    return await this.findById(postId);
  }

  async addlike(postId: number, userId: number): Promise<Post> {
    const post = await this.findById(postId);
    if (!post) throw new BadRequestException('Статтю не знайдено!');

    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('Користувача не знайдено!');

    const isLiked = post.likes.some((like) => like.userId === userId);

    if (!isLiked) await this.prisma.postLike.create({ data: { postId, userId } });

    return await this.findById(postId);
  }

  async removeLike(postId: number, userId: number): Promise<Post> {
    await this.prisma.postLike.deleteMany({ where: { postId, userId } });

    return await this.findById(postId);
  }

  private async countDocs(input: Prisma.PostWhereInput): Promise<number> {
    return await this.prisma.post.count({ where: input });
  }

  private getWhereClause(payload: FilterPostsDto): Prisma.PostWhereInput {
    let where: Prisma.PostWhereInput = {};

    if (payload.title) where.title = { contains: payload.title, mode: 'insensitive' };
    if (payload.slug) where.slug = { contains: payload.slug, mode: 'insensitive' };
    if (payload.isActive) where.isActive = payload.isActive === true;

    return where;
  }

  private getOrderByClause(payload: FilterPostsDto): Prisma.ProductOrderByWithRelationInput {
    return { [payload.orderBy || 'createdAt']: payload.orderMode || 'asc' };
  }

  private getPagination(payload: FilterPostsDto): { skip: number; take: number } {
    const page = payload.page || 1;
    const limit = payload.limit || 12;

    const skip = (page - 1) * limit;
    return { skip, take: limit };
  }
}
