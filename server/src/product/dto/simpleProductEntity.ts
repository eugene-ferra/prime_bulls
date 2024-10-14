import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductImageEntity } from './productImageEntity.js';
import { CategoryEntity } from './productCategoryEntity.js';

@Exclude()
export class SimpleProductEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  subtitle: string;

  @ApiProperty({ type: () => CategoryEntity })
  @Expose()
  @Transform(({ value }) => ({
    name: value.name,
    slug: value.slug,
  }))
  category: CategoryEntity;

  @ApiProperty()
  @Expose()
  basePrice: number;

  @ApiProperty()
  @Expose()
  salePercent: number;

  @ApiProperty({ type: () => ProductImageEntity })
  @Expose()
  @Transform(({ obj }) => ({
    url: obj.coverImageUrl,
    altText: obj.coverImageAltText,
  }))
  coverImage: ProductImageEntity;

  constructor(partial: Partial<SimpleProductEntity>) {
    Object.assign(this, partial);
  }
}
