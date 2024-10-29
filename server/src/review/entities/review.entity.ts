import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AuthorEntity } from '../../common/entities/author.entity.js';
import { ImageEntity } from '../../common/entities/image.entity.js';

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

  @ApiProperty({ type: () => AuthorEntity })
  @Expose()
  @Transform(({ obj }) => new AuthorEntity(obj.user))
  user?: AuthorEntity;

  @ApiProperty({ type: () => [ReviewEntity] })
  @Expose()
  @Transform(({ value }) => value?.map((item: ReviewEntity) => new ReviewEntity(item)))
  reviews?: ReviewEntity[];

  @ApiProperty({ type: () => [ImageEntity] })
  @Expose()
  @Transform(({ value }) =>
    value?.map((item: ImageEntity) => new ImageEntity({ url: item.url, altText: item.altText })),
  )
  images?: ImageEntity[];

  @ApiProperty()
  @Expose()
  replyCount?: number;

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value?.map((item) => ({ userId: item.userId })))
  likes?: any[];

  constructor(partial: Partial<ReviewEntity>) {
    Object.assign(this, partial);
  }
}
