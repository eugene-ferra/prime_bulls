import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ImageEntity } from './image.entity.js';

@Exclude()
export class AuthorEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiPropertyOptional()
  @Expose()
  lastName?: string;

  @ApiProperty({ type: () => ImageEntity })
  @Expose()
  @Transform(({ obj }) => new ImageEntity({ url: obj.imageUrl, altText: obj.altText }))
  coverImage?: ImageEntity;

  constructor(partial: Partial<AuthorEntity>) {
    Object.assign(this, partial);
  }
}
