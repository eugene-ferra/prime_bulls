import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewAuthorEntity } from './review-author.entity.js';
import { ReviewImageEntity } from './review-image.entity.js';

@Exclude()
export class ReviewEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  parentReviewId: number;

  @ApiProperty()
  @Expose()
  comment: string;

  @ApiProperty()
  @Expose()
  rating?: number;

  @ApiProperty({ type: () => ReviewAuthorEntity })
  @Expose()
  @Transform(({ obj }) => new ReviewAuthorEntity(obj.user))
  user?: ReviewAuthorEntity;

  @ApiProperty({ type: () => [ReviewEntity] })
  @Expose()
  @Transform(({ value }) => value?.map((item: ReviewEntity) => new ReviewEntity(item)))
  reviews?: ReviewEntity[];

  @ApiProperty({ type: () => [ReviewImageEntity] })
  @Expose()
  @Transform(({ value }) =>
    value?.map((item: ReviewImageEntity) => new ReviewImageEntity({ url: item.url, altText: item.altText })),
  )
  images?: ReviewImageEntity[];

  @ApiProperty()
  @Expose()
  replyCount?: number;

  constructor(partial: Partial<ReviewEntity>) {
    Object.assign(this, partial);
  }
}
