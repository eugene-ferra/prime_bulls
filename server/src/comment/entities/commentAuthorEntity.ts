import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { CommentAuthorAvatarEntity } from './commentAuthorAvatarEntity.js';

@Exclude()
export class CommentAuthorEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  lastName?: string;

  @ApiProperty({ type: () => CommentAuthorAvatarEntity })
  @Expose()
  @Transform(({ obj }) => new CommentAuthorAvatarEntity({ url: obj.imageUrl, altText: obj.altText }))
  coverImage?: CommentAuthorAvatarEntity;

  constructor(partial: Partial<CommentAuthorEntity>) {
    Object.assign(this, partial);
  }
}
