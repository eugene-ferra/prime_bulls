import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from '../dto/createReview.dto.js';
import { UpdateReviewDto } from '../dto/updateReview.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProductService } from '../../product/services/product.service.js';
import { UserService } from '../../user/user.service.js';
import { FilterReviewDto } from '../dto/filterReview.dto.js';
import { Prisma } from '@prisma/client';
import { Review } from '../types/review.type.js';
import { PaginatedResult } from '../../common/types/paginatedResult.type.js';
import { ReviewImageService } from './reviewImage.service.js';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly reviewImageService: ReviewImageService,
  ) {}

  async create(userId: number, data: CreateReviewDto, files?: Express.Multer.File[]): Promise<Review> {
    if (!(await this.productService.isExists(data.productId)))
      throw new BadRequestException('Товар не знайдено!');

    if (!(await this.userService.isExists(userId))) throw new BadRequestException('Користувача не знайдено!');

    const review = await this.prismaService.review.create({ data: { ...data, userId } });
    if (files) await this.reviewImageService.saveImages(files, review.id);

    return await this.findById(review.id);
  }

  async delete(id: number, userId: number): Promise<void> {
    const review = await this.findById(id);

    if (!review) throw new BadRequestException('Відгук не знайдено!');
    if (review.userId !== userId) throw new BadRequestException('Ви не маєте права видаляти цей відгук!');

    await this.reviewImageService.removeImages(review);
    await this.prismaService.review.delete({ where: { id } });
  }

  async update(
    id: number,
    userId: number,
    data: UpdateReviewDto,
    files?: Express.Multer.File[],
  ): Promise<Review> {
    const review = await this.findById(id);

    if (!review) throw new BadRequestException('Відгук не знайдено!');
    if (review.userId !== userId) throw new BadRequestException('Ви не маєте права редагувати цей відгук!');

    await this.prismaService.review.update({ where: { id }, data });

    if (files.length) {
      await this.reviewImageService.removeImages(review);
      await this.reviewImageService.saveImages(files, id);
    }

    return await this.findById(id);
  }

  async findAll(payload: FilterReviewDto): Promise<PaginatedResult<Review>> {
    const where = this.getWhereClause(payload);
    const orderBy = this.getOrderByClause(payload);
    const { skip, take } = this.getPagination(payload);

    const [reviews, totalDocs] = await Promise.all([
      this.prismaService.review.findMany({
        where,
        include: {
          images: true,
          user: true,
          reviews: { include: { images: true, user: true, likes: true } },
          likes: true,
        },
        orderBy,
        skip,
        take,
      }),
      this.prismaService.review.count({ where }),
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

  async findById(id: number): Promise<Review> {
    const doc = await this.prismaService.review.findUnique({
      where: { id },
      include: {
        images: true,
        user: true,
        likes: true,
        reviews: { include: { images: true, user: true, likes: true } },
      },
    });

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
    return this.prismaService.review.count({ where: { parentReviewId: reviewId } });
  }
}
