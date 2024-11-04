import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Prisma } from '@prisma/client';
import { FilterProductsDto } from './dto/filterProducts.dto.js';
import { PaginatedResult } from 'src/common/types/paginatedResult.type.js';
import { SimpleProduct } from './types/SimpleProduct.type.js';
import { ExpandedProduct } from './types/expandedProduct.type.js';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(payload: FilterProductsDto): Promise<PaginatedResult<SimpleProduct>> {
    const where = this.getWhereClause(payload);
    const orderBy = this.getOrderByClause(payload);
    const { skip, take } = this.getPagination(payload);
    const include: Prisma.ProductInclude = { category: true };

    const [products, totalDocs] = await Promise.all([
      this.prisma.product.findMany({ where, orderBy, skip, take, include }),
      this.countDocs(where),
    ]);

    if (!products.length) return { data: [], lastPage: 1 };

    const productsWithReviewData = await Promise.all(
      products.map(async (product) => {
        const { reviewCount, avgReview } = await this.aggregateReviewData(product.id);
        return { ...product, reviewCount, avgReview };
      }),
    );

    return {
      data: productsWithReviewData,
      lastPage: Math.ceil(totalDocs / take),
    };
  }

  async findById(id: number): Promise<ExpandedProduct> {
    const doc = await this.prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
        images: true,
        attributes: {
          include: { attribute: true },
        },
        productVariants: {
          include: { variant: true },
        },
      },
    });

    if (!doc) return null;

    const { reviewCount, avgReview } = await this.aggregateReviewData(doc.id);
    return { ...doc, reviewCount, avgReview };
  }

  async findBySlug(slug: string): Promise<ExpandedProduct> {
    const doc = await this.prisma.product.findUnique({
      where: { slug },
      include: {
        category: true,
        images: true,
        attributes: {
          include: { attribute: true },
        },
        productVariants: {
          include: { variant: true },
        },
      },
    });

    if (!doc) return null;

    const { reviewCount, avgReview } = await this.aggregateReviewData(doc.id);
    return { ...doc, reviewCount, avgReview };
  }

  async aggregateReviewData(productId: number): Promise<{ reviewCount: number; avgReview: number }> {
    const reviewAggregation = await this.prisma.review.aggregate({
      where: { AND: [{ isModerated: true }, { productId: productId }] },
      _avg: { rating: true },
      _count: true,
    });

    return { reviewCount: reviewAggregation._count, avgReview: reviewAggregation._avg.rating };
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
    where.isActive = true;

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
}
