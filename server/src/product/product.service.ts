import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service.js';
import { Prisma } from '@prisma/client';
import { FilterProductsDto } from './dto/filterProducts.dto.js';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(payload: {
    where: Prisma.ProductWhereInput;
    orderBy?: Prisma.ProductOrderByWithRelationInput;
    include?: Prisma.ProductInclude;
    page?: number;
    limit?: number;
  }) {
    const currentPage = payload.page || 1;
    const take = payload.limit || 12;
    const skip = currentPage * take - take;
    const include = payload.include || {};
    const where = payload.where;
    const orderBy = payload.orderBy;

    return await this.prisma.product.findMany({ where, include, orderBy, skip, take });
  }

  async findById(id: number) {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async findBySlug(slug: string, include?: Prisma.ProductInclude) {
    return await this.prisma.product.findFirst({ where: { slug }, include });
  }

  async countDocs(input: Prisma.ProductWhereInput) {
    return await this.prisma.product.count({ where: input });
  }

  toPrismaSearch(payload: FilterProductsDto) {
    let where: Prisma.ProductWhereInput = {};
    let orderBy: Prisma.ProductOrderByWithRelationInput = {};

    let page: number = 1,
      limit: number = 12;

    if (payload.title) where.title = { contains: payload.title, mode: 'insensitive' };
    if (payload.subtitle) where.title = { contains: payload.subtitle, mode: 'insensitive' };
    if (payload.slug) where.slug = { contains: payload.slug, mode: 'insensitive' };
    if (payload.categoryId) where.categoryId = payload.categoryId;
    if (payload.basePrice) where.basePrice = { gte: payload.basePrice[0], lte: payload.basePrice[1] };
    if (payload.salePercent) where.salePercent = { gte: payload.salePercent[0], lte: payload.salePercent[1] };
    if (payload.isActive) where.isActive = payload.isActive === true;

    orderBy = { [payload.orderBy || 'createdAt']: payload.orderMode || 'asc' };

    if (payload.page) page = payload.page;
    if (payload.limit) limit = payload.limit;

    return { where, orderBy, page, limit };
  }
}
