import { BadRequestException, Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service.js';
import { AccessGuard } from '../../common/guards/access.guard.js';
import { ReviewEntity } from '../entities/review.entity.js';
import { Request } from 'express';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';
import { ReviewLikeService } from '../services/reviewLike.service.js';

@ApiTags('reviews')
@ApiBadRequestResponse()
@UseGuards(AccessGuard)
@Controller('reviews/:id/like')
export class ReviewLikeController {
  constructor(
    private readonly reviewService: ReviewService,
    private readonly likeService: ReviewLikeService,
  ) {}

  @ApiSingleResponse(ReviewEntity, 201)
  @Post('/')
  async addLikeToComment(@Param('id') id: number, @Req() req: Request): Promise<ReviewEntity> {
    const review = await this.reviewService.findById(id);
    if (!review) throw new BadRequestException('Відгук не знайдено!');

    await this.likeService.addlike(review, req.user.id);
    const updatedReview = await this.reviewService.findById(id);

    return new ReviewEntity(updatedReview);
  }

  @ApiSingleResponse(ReviewEntity, 200)
  @Delete('/')
  async removelikeFromComment(@Param('id') id: number, @Req() req: Request): Promise<ReviewEntity> {
    await this.likeService.removeLike(id, req.user.id);

    const doc = await this.reviewService.findById(id);
    if (!doc) throw new BadRequestException('Відгук не знайдено!');

    return new ReviewEntity(doc);
  }
}
