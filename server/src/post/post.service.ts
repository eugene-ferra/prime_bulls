import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { FilterPostsDto } from './dto/filterPosts.dto.js';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  private _defaultInclude: Prisma.PostInclude = { topics: { include: { topic: true } } };

  async findAll(payload: FilterPostsDto) {
    const where = this.getWhereClause(payload);
    const orderBy = this.getOrderByClause(payload);
    const { skip, take } = this.getPagination(payload);
    const include = this._defaultInclude;

    const [posts, totalDocs] = await Promise.all([
      this.prisma.post.findMany({ where, include, orderBy, skip, take }),
      this.countDocs(where),
    ]);

    return {
      data: posts,
      currentPage: payload.page || 1,
      lastPage: Math.ceil(totalDocs / take),
    };
  }

  async findById(
    id: number,
  ): Promise<Prisma.PostGetPayload<{ include: { topics: { include: { topic: true } } } }> | null> {
    return await this.prisma.post.findUnique({
      where: { id },
      include: { topics: { include: { topic: true } } },
    });
  }

  async findBySlug(slug: string) {
    return await this.prisma.post.findFirst({ where: { slug }, include: this._defaultInclude });
  }

  private async countDocs(input: Prisma.PostWhereInput) {
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
