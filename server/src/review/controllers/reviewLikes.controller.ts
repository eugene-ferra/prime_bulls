import { Controller, Delete, Param, Post, Req, UseGuards } from '@nestjs/common';
import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { ReviewService } from '../services/review.service.js';
import { AccessGuard } from '../../common/guards/access.guard.js';
import { ReviewEntity } from '../entities/review.entity.js';
import { Request } from 'express';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';

@ApiTags('reviews')
@ApiBadRequestResponse()
@UseGuards(AccessGuard)
@Controller('reviews/:id/like')
export class ReviewLikeController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiSingleResponse(ReviewEntity, 201)
  @Post('/')
  async addLikeToComment(@Param('id') id: number, @Req() req: Request): Promise<ReviewEntity> {
    const review = await this.reviewService.addlike(id, req.user.id);
    return new ReviewEntity(review);
  }

  @ApiSingleResponse(ReviewEntity, 200)
  @Delete('/')
  async removelikeFromComment(@Param('id') id: number, @Req() req: Request): Promise<ReviewEntity> {
    const doc = await this.reviewService.removeLike(id, req.user.id);
    return new ReviewEntity(doc);
  }
}
