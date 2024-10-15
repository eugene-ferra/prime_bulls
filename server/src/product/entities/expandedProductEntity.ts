import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductVariantEntity } from './productVariantEntity.js';
import { ProductAttributeEntity } from './productAttributeEntity.js';
import { ProductImageEntity } from './productImageEntity.js';
import { ProductCategoryEntity } from './productCategoryEntity.js';

@Exclude()
export class ExpandedProductEntity {
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
  description: string;

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
  @Transform(({ obj }) => ({ url: obj.coverImageUrl, altText: obj.coverImageAltText }))
  coverImage: ProductImageEntity;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: () => [ProductImageEntity] })
  @Expose()
  @Transform(({ value }) => value.map((item: ProductImageEntity) => new ProductImageEntity(item)))
  images: ProductImageEntity[];

  @ApiProperty({ type: () => [ProductVariantEntity] })
  @Expose()
  @Transform(({ value }) => value.map((item: ProductVariantEntity) => new ProductVariantEntity(item)))
  productVariants: ProductVariantEntity[];

  @ApiProperty({ type: () => [ProductAttributeEntity] })
  @Expose()
  @Transform(({ value }) => value.map((item: ProductAttributeEntity) => new ProductAttributeEntity(item)))
  attributes: ProductAttributeEntity[];

  // TODO: add reviews stats

  constructor(partial: Partial<ExpandedProductEntity>) {
    Object.assign(this, partial);
  }
}
