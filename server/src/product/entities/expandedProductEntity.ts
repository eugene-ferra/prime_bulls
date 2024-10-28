import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductVariantEntity } from './productVariant.entity.js';
import { ProductAttributeEntity } from './productAttribute.entity.js';
import { ProductCategoryEntity } from './productCategory.entity.js';
import { ImageEntity } from '../../common/entities/image.entity.js';

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

  @ApiProperty({ type: () => ImageEntity })
  @Expose()
  @Transform(({ obj }) => ({ url: obj.coverImageUrl, altText: obj.coverImageAltText }))
  coverImage: ImageEntity;

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: () => [ImageEntity] })
  @Expose()
  @Transform(({ value }) => value.map((item: ImageEntity) => new ImageEntity(item)))
  images: ImageEntity[];

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
