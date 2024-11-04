import { ApiProperty } from '@nestjs/swagger';
import { ReplyEntity } from './reply.entity.js';
import { Review } from '../types/review.type.js';

export class ReviewEntity extends ReplyEntity {
  @ApiProperty()
  replies: ReplyEntity[];

  constructor(review: Review) {
    super(review);

    this.replies = review.reviews.map((reply) => new ReplyEntity(reply));
  }
}
