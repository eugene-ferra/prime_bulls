import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductImageEntity } from './productImageEntity.js';
import { ProductCategoryEntity } from './productCategoryEntity.js';

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

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => new ProductCategoryEntity(value))
  category: ProductCategoryEntity;

  @ApiProperty()
  @Expose()
  basePrice: number;

  @ApiProperty()
  @Expose()
  salePercent: number;

  @ApiProperty({ type: () => ProductImageEntity })
  @Expose()
  @Transform(({ obj }) => new ProductImageEntity({ url: obj.coverImageUrl, altText: obj.coverImageAltText }))
  coverImage: ProductImageEntity;

  // TODO: add reviews data

  constructor(partial: Partial<SimpleProductEntity>) {
    Object.assign(this, partial);
  }
}
