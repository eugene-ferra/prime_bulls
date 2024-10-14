import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductVariantEntity, TransformedProductVariant } from './productVariantEntity.js';
import { ProductAttribute, TransformedProductAttribute } from './productAttributeEntity.js';
import { ProductImageEntity } from './productImageEntity.js';
import { CategoryEntity } from './productCategoryEntity.js';

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

  @ApiProperty()
  @Expose()
  isActive: boolean;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty({ type: () => [ProductImageEntity] })
  @Expose()
  @Transform(({ value }) =>
    value.map((item: ProductImageEntity) => ({
      url: item.url,
      altText: item.altText,
    })),
  )
  images: ProductImageEntity[];

  @ApiProperty({ type: () => [TransformedProductVariant] })
  @Expose()
  @Transform(({ value }) =>
    Object.values(
      value.reduce((acc: Record<string, TransformedProductVariant>, item: ProductVariantEntity) => {
        const variantName = item.variant?.name;
        if (!acc[variantName]) {
          acc[variantName] = { variant: variantName, values: [] };
        }
        acc[variantName].values.push({
          label: item.label,
          effectType: item.effectType,
          amount: item.amount,
        });
        return acc;
      }, {}),
    ),
  )
  productVariants: ProductVariantEntity[];

  @ApiProperty({ type: () => [TransformedProductAttribute] })
  @Expose()
  @Transform(({ value }) =>
    value.map((item: ProductAttribute) => ({
      name: item.attribute?.name,
      value: item.value,
    })),
  )
  attributes: ProductAttribute[];

  // TODO: add reviews stats

  constructor(partial: Partial<ExpandedProductEntity>) {
    Object.assign(this, partial);
  }
}
