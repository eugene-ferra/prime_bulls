import { ApiProperty } from '@nestjs/swagger';
import { AuthorEntity } from '../../common/entities/author.entity.js';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { Reply } from '../types/reply.type.js';

export class ReplyEntity {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly parentReviewId: number;

  @ApiProperty()
  readonly comment: string;

  @ApiProperty()
  readonly rating: number;

  @ApiProperty({ type: AuthorEntity })
  readonly user: AuthorEntity;

  @ApiProperty({ type: [ImageEntity] })
  readonly images: ImageEntity[];

  @ApiProperty()
  readonly replyCount: number;

  @ApiProperty()
  readonly likes: number;

  constructor(review: Reply) {
    this.id = review.id;
    this.parentReviewId = review.parentReviewId;
    this.comment = review.comment;
    this.rating = review.rating;
    this.user = new AuthorEntity(review.user);
    this.images = review.images.map((image) => new ImageEntity(image));
    this.replyCount = review.replyCount;
    this.likes = review.likes.length;
  }
}
