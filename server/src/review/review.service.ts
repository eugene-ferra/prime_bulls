import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from './dto/createReview.dto.js';
import { UpdateReviewDto } from './dto/updateReview.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ProductService } from '../product/product.service.js';
import { UserService } from '../user/user.service.js';
import { ImageService } from '../file/image.service.js';
import { FilterReviewDto } from './dto/filterReview.dto.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReviewService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly productService: ProductService,
    private readonly userService: UserService,
    private readonly imageService: ImageService,
  ) {}

  private folder = 'reviews';

  async create(userId: number, data: CreateReviewDto, files?: Express.Multer.File[]) {
    const product = await this.productService.findById(data.productId);
    if (!product) throw new BadRequestException('Товар не знайдено!');

    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('Користувача не знайдено!');

    const review = await this.prismaService.review.create({ data: { ...data, userId } });

    if (files?.length) {
      const images = await Promise.all(
        files.map((file) =>
          this.imageService.saveImage(file, this.folder, review.id, file.originalname, {
            width: 800,
            fit: 'contain',
          }),
        ),
      );

      await this.prismaService.reviewImage.createMany({
        data: images.map((image, i) => ({
          reviewId: review.id,
          url: image.url,
          mimeType: image.mime,
          altText: `${review.id}-${i}`,
        })),
      });
    }
  }

  async delete(id: number, userId: number) {
    const review = await this.findById(id);
    if (!review) throw new BadRequestException('Відгук не знайдено!');

    if (review.userId !== userId) throw new BadRequestException('Ви не маєте права видаляти цей відгук!');

    if (review.images.length) {
      await Promise.all([
        review.images.map((image) => this.imageService.deleteImage(this.folder, image.url)),
        this.prismaService.reviewImage.deleteMany({ where: { reviewId: id } }),
      ]);
    }
    await this.prismaService.review.delete({ where: { id } });
  }

  async update(id: number, userId: number, data: UpdateReviewDto, files?: Express.Multer.File[]) {
    const review = await this.findById(id);
    if (!review) throw new BadRequestException('Відгук не знайдено!');

    if (review.userId !== userId) throw new BadRequestException('Ви не маєте права редагувати цей відгук!');

    await this.prismaService.review.update({ where: { id }, data });

    if (files?.length) {
      if (review.images.length) {
        await Promise.all([
          review.images.map((image) => this.imageService.deleteImage(this.folder, image.url)),
          this.prismaService.reviewImage.deleteMany({ where: { reviewId: id } }),
        ]);
      }

      const images = await Promise.all(
        files.map((file) =>
          this.imageService.saveImage(file, this.folder, id, file.originalname, {
            width: 800,
            fit: 'contain',
          }),
        ),
      );

      await this.prismaService.reviewImage.createMany({
        data: images.map((image, i) => ({
          reviewId: id,
          url: image.url,
          mimeType: image.mime,
          altText: `${id}-${i}`,
        })),
      });
    }
  }

  async findAll(payload: FilterReviewDto) {
    const where = this.getWhereClause(payload);
    const orderBy = this.getOrderByClause(payload);
    const { skip, take } = this.getPagination(payload);

    const [reviews, totalDocs] = await Promise.all([
      this.prismaService.review.findMany({
        where,
        include: { images: true, user: true, reviews: { include: { images: true, user: true } } },
        orderBy,
        skip,
        take,
      }),
      this.prismaService.review.count({ where }),
    ]);

    const reviewsWithReplyCount = await Promise.all(
      reviews.map(async (review) => {
        const repliesWithCount = await Promise.all(
          review.reviews.map(async (reply) => {
            const replyCount = await this.prismaService.review.count({
              where: { parentReviewId: reply.id },
            });

            return { ...reply, replyCount };
          }),
        );

        return { ...review, reviews: repliesWithCount };
      }),
    );

    return {
      data: reviewsWithReplyCount,
      currentPage: payload.page || 1,
      lastPage: Math.ceil(totalDocs / take),
    };
  }

  async findById(id: number) {
    return this.prismaService.review.findUnique({
      where: { id },
      include: { images: true, reviews: true, user: true },
    });
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
}
