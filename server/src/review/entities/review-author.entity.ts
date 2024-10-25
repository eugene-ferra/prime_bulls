import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ReviewAuthorAvatarEntity } from './review-author-avatar.entity.js';

@Exclude()
export class ReviewAuthorEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  lastName?: string;

  @ApiProperty({ type: () => ReviewAuthorAvatarEntity })
  @Expose()
  @Transform(({ obj }) => new ReviewAuthorAvatarEntity({ url: obj.imageUrl, altText: obj.altText }))
  coverImage?: ReviewAuthorAvatarEntity;

  constructor(partial: Partial<ReviewAuthorEntity>) {
    Object.assign(this, partial);
  }
}
