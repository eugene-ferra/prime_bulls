import { ApiProperty } from '@nestjs/swagger';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { Category } from '../types/category.type.js';

export class CategoryEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  icon: ImageEntity;

  constructor(data: Category) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
    this.icon = new ImageEntity({ url: data.iconUrl, altText: data.altText });
  }
}
