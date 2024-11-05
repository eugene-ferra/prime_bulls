import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Review } from '../types/review.type.js';
import { UserService } from '../../user/user.service.js';

@Injectable()
export class ReviewLikeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async addlike(review: Review, userId: number): Promise<void> {
    if (!(await this.userService.isExists(userId))) throw new BadRequestException('Користувача не знайдено!');

    if (!(await this.isLiked(review, userId)))
      await this.prismaService.reviewLike.create({ data: { reviewId: review.id, userId } });
  }

  async removeLike(reviewId: number, userId: number): Promise<void> {
    await this.prismaService.reviewLike.deleteMany({ where: { reviewId, userId } });
  }

  private async isLiked(review: Review, userId: number): Promise<boolean> {
    return review.likes.some((like) => like.userId === userId);
  }
}