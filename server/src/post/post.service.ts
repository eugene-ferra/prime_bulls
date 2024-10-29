import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import { FilterPostsDto } from './dto/filterPosts.dto.js';
import { DeviceDto } from 'src/common/dto/device.dto.js';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  private _defaultInclude: Prisma.PostInclude = { topics: { include: { topic: true } }, views: true };

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

  async findById(id: number) {
    return await this.prisma.post.findUnique({
      where: { id },
      include: this._defaultInclude,
    });
  }

  async findBySlug(slug: string) {
    return await this.prisma.post.findFirst({ where: { slug }, include: this._defaultInclude });
  }

  async addView(postId: number, device: DeviceDto) {
    const { ip, userAgent } = device;
    const post = await this.prisma.post.findUnique({ where: { id: postId }, include: { views: true } });
    if (!post) return;

    const isViewed = post.views.some((view) => view.ip === ip && view.userAgent === userAgent);
    if (isViewed) return;

    await this.prisma.view.create({ data: { postId, ip, userAgent } });
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
