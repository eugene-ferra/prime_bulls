import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../prisma/prisma.service.js';
import { FilterPostsDto } from '../dto/filterPosts.dto.js';
import { PaginatedResult } from '../../common/types/paginatedResult.type.js';
import { Post } from '../types/Post.type.js';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

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
      this.prisma.post.count({ where }),
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

  async isExist(id: number): Promise<boolean> {
    return !!(await this.prisma.post.findUnique({ where: { id } }));
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
