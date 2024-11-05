import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ImageEntity } from './image.entity.js';

export class AuthorEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  lastName?: string;

  @ApiProperty({ type: () => ImageEntity })
  coverImage?: ImageEntity;

  constructor(data: { id: number; name: string; lastName?: string; imageUrl: string; altText: string }) {
    this.id = data.id;
    this.name = data.name;
    this.lastName = data.lastName;
    this.coverImage = new ImageEntity({ url: data.imageUrl, altText: data.altText });
  }
}
