import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProductService } from '../../product/services/product.service.js';
import { UserService } from '../../user/services/user.service.js';
import { CreateReviewDto } from '../dto/createReview.dto.js';
import { Review } from '../types/review.type.js';
import { FilterReviewDto } from '../dto/filterReview.dto.js';
import { Prisma } from '@prisma/client';
import { PaginatedResult } from '../../common/types/paginatedResult.type.js';
import { Image } from '../../common/dto/image.dto.js';
import { UpdateReviewDto } from '../dto/updateReview.dto.js';

@Injectable()
export class ReviewRepository {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
    private readonly productService: ProductService,
  ) {}

  private _include = {
    images: true,
    user: true,
    reviews: { include: { images: true, user: true, likes: true } },
    likes: true,
  };

  async findOne(id: number): Promise<Review> {
    const doc = await this.prisma.review.findUnique({ where: { id }, include: this._include });

    if (!doc) return null;

    const docWithReplyCount = {
      ...doc,
      replyCount: await this.getReplyCount(doc.id),
      reviews: await Promise.all(
        doc.reviews.map(async (reply) => ({
          ...reply,
          replyCount: await this.getReplyCount(reply.id),
        })),
      ),
    };

    return docWithReplyCount;
  }

  async save(userId: number, productId: number, review: CreateReviewDto): Promise<Review> {
    if (!(await this.userService.isExists(userId))) throw new BadRequestException('Користувача не знайдено!');
    if (!(await this.productService.isExists(productId))) throw new BadRequestException('Товар не знайдено!');

    const doc = await this.prisma.review.create({ data: { ...review, userId }, include: this._include });

    return await this.findOne(doc.id);
  }

  async update(id: number, review: UpdateReviewDto): Promise<void> {
    await this.prisma.review.update({ where: { id }, data: review });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.review.delete({ where: { id } });
  }

  async isExists(id: number): Promise<boolean> {
    return !!(await this.prisma.review.findUnique({ where: { id } }));
  }

  async saveImageUrls(images: Image[], reviewId: number): Promise<void> {
    await this.prisma.reviewImage.createMany({
      data: images.map(({ url, mime }, i) => ({
        reviewId,
        url,
        mimeType: mime,
        altText: `${reviewId}-${i}`,
      })),
    });
  }

  async findAll(payload: FilterReviewDto): Promise<PaginatedResult<Review>> {
    const where = this.getWhereClause(payload);
    const orderBy = this.getOrderByClause(payload);
    const { skip, take } = this.getPagination(payload);

    const [reviews, totalDocs] = await Promise.all([
      this.prisma.review.findMany({ where, include: this._include, orderBy, skip, take }),
      this.prisma.review.count({ where }),
    ]);

    const reviewsWithReplyCount = await Promise.all(
      reviews.map(async (review) => ({
        ...review,
        replyCount: await this.getReplyCount(review.id),
        reviews: await Promise.all(
          review.reviews.map(async (reply) => ({
            ...reply,
            replyCount: await this.getReplyCount(reply.id),
          })),
        ),
      })),
    );

    return {
      data: reviewsWithReplyCount,
      lastPage: Math.ceil(totalDocs / take),
    };
  }

  private getWhereClause(payload: FilterReviewDto): Prisma.ReviewWhereInput {
    const where: Prisma.ReviewWhereInput = {
      productId: payload.productId,
      userId: payload.userId,
      parentReviewId: payload.parentReviewId || null,
      isModerated: payload.isModerated || undefined,
    };

    return where;
  }

  private getOrderByClause(payload: FilterReviewDto): Prisma.ReviewOrderByWithRelationInput {
    return { [payload.orderBy || 'createdAt']: payload.orderMode || 'asc' };
  }

  private getPagination(payload: FilterReviewDto): { skip: number; take: number } {
    const page = payload.page || 1;
    const limit = payload.limit || 5;

    const skip = (page - 1) * limit;

    return { skip, take: limit };
  }

  private async getReplyCount(reviewId: number): Promise<number> {
    return this.prisma.review.count({ where: { parentReviewId: reviewId } });
  }
}
