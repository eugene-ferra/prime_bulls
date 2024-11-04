import { ApiProperty } from '@nestjs/swagger';
import { AuthorEntity } from '../../common/entities/author.entity.js';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { Reply } from '../types/reply.type.js';

export class ReplyEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  parentReviewId: number;

  @ApiProperty()
  comment: string;

  @ApiProperty()
  rating: number;

  @ApiProperty({ type: AuthorEntity })
  user: AuthorEntity;

  @ApiProperty({ type: [ImageEntity] })
  images: ImageEntity[];

  @ApiProperty()
  replyCount: number;

  @ApiProperty()
  likes: number;

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
