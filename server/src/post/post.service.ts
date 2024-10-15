import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma-service/prisma-service.service.js';
import { FilterPostsDto } from './dto/filterPosts.dto.js';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findAll(payload: {
    where: Prisma.PostWhereInput;
    include?: Prisma.PostInclude;
    page?: number;
    limit?: number;
  }) {
    const currentPage = payload.page || 1;
    const take = payload.limit || 12;
    const skip = currentPage * take - take;
    const include = payload.include || {};
    const where = payload.where;

    return await this.prisma.post.findMany({ where, include, orderBy: { createdAt: 'desc' }, skip, take });
  }

  async findById(id: number, include?: Prisma.PostInclude) {
    return await this.prisma.post.findUnique({ where: { id }, include });
  }

  async findBySlug(slug: string, include?: Prisma.PostInclude) {
    return await this.prisma.post.findFirst({ where: { slug }, include });
  }

  async countDocs(input: Prisma.PostWhereInput) {
    return await this.prisma.post.count({ where: input });
  }

  toPrismaSearch(payload: FilterPostsDto) {
    let where: Prisma.PostWhereInput = {};
    let page: number = 1,
      limit: number = 12;

    if (payload.title) where.title = { contains: payload.title, mode: 'insensitive' };
    if (payload.slug) where.slug = { contains: payload.slug, mode: 'insensitive' };
    if (payload.isActive) where.isActive = payload.isActive === true;

    if (payload.page) page = payload.page;
    if (payload.limit) limit = payload.limit;

    return { where, page, limit };
  }
}
