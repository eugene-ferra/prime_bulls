import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import { FilterProductsDto } from './dto/filterProducts.dto.js';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(payload: FilterProductsDto) {
    const where = this.getWhereClause(payload);
    const orderBy = this.getOrderByClause(payload);
    const { skip, take } = this.getPagination(payload);
    const include: Prisma.ProductInclude = { category: true };

    const [products, totalDocs] = await Promise.all([
      this.prisma.product.findMany({ where, orderBy, skip, take, include }),
      this.countDocs(where),
    ]);

    return {
      data: products,
      currentPage: payload.page || 1,
      lastPage: Math.ceil(totalDocs / take),
    };
  }

  async findById(id: number) {
    const include = this.getDefaultInclude();

    return await this.prisma.product.findUnique({ where: { id }, include });
  }

  async findBySlug(slug: string) {
    const include = this.getDefaultInclude();
    return await this.prisma.product.findFirst({ where: { slug }, include });
  }

  private async countDocs(where: Prisma.ProductWhereInput) {
    return await this.prisma.product.count({ where });
  }

  private getWhereClause(payload: FilterProductsDto): Prisma.ProductWhereInput {
    const where: Prisma.ProductWhereInput = {};

    if (payload.title) where.title = { contains: payload.title, mode: 'insensitive' };
    if (payload.subtitle) where.subtitle = { contains: payload.subtitle, mode: 'insensitive' };
    if (payload.slug) where.slug = { contains: payload.slug, mode: 'insensitive' };
    if (payload.categoryId) where.categoryId = payload.categoryId;
    if (payload.minPrice) where.basePrice = { gte: payload.minPrice };
    if (payload.maxPrice) where.basePrice = { lte: payload.maxPrice };
    if (payload.isActive !== undefined) where.isActive = payload.isActive;

    return where;
  }

  private getOrderByClause(payload: FilterProductsDto): Prisma.ProductOrderByWithRelationInput {
    return { [payload.orderBy || 'createdAt']: payload.orderMode || 'asc' };
  }

  private getPagination(payload: FilterProductsDto): { skip: number; take: number } {
    const page = payload.page || 1;
    const limit = payload.limit || 12;

    const skip = (page - 1) * limit;
    return { skip, take: limit };
  }

  private getDefaultInclude(): Prisma.ProductInclude {
    return {
      category: true,
      images: true,
      attributes: {
        include: { attribute: true },
      },
      productVariants: {
        include: { variant: true },
      },
    };
  }
}
