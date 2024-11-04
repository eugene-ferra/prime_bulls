import { ApiProperty } from '@nestjs/swagger';
import { ProductVariantEntity } from './productVariant.entity.js';
import { ProductAttributeEntity } from './productAttribute.entity.js';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { ExpandedProduct } from '../types/expandedProduct.type.js';
import { SimpleProductEntity } from './simpleProduct.entity.js';

export class ExpandedProductEntity extends SimpleProductEntity {
  @ApiProperty()
  readonly description: string;

  @ApiProperty({ isArray: true, type: ImageEntity })
  readonly images: ImageEntity[];

  @ApiProperty({ isArray: true, type: ProductVariantEntity })
  readonly variants: ProductVariantEntity[];

  @ApiProperty({ isArray: true, type: ProductAttributeEntity })
  readonly attributes: ProductAttributeEntity[];

  constructor(product: ExpandedProduct) {
    super(product);

    this.description = product.description;
    this.images = this.createImageEntities(product.images);
    this.attributes = this.createAttributeEntities(product.attributes);
    this.variants = this.createVariantEntities(product.productVariants);
  }

  private createImageEntities(images: { url: string; altText: string }[]): ImageEntity[] {
    return images.map(({ url, altText }) => new ImageEntity({ url, altText }));
  }

  private createAttributeEntities(
    attributes: { value: string; attribute: { name: string } }[],
  ): ProductAttributeEntity[] {
    return attributes.map(
      (attr) =>
        new ProductAttributeEntity({
          value: attr.value,
          name: attr.attribute.name,
        }),
    );
  }

  private createVariantEntities(
    variants: { variant: { name: string }; label: string; effectType: string; amount: number }[],
  ): ProductVariantEntity[] {
    return variants.map(
      ({ variant, label, effectType, amount }) =>
        new ProductVariantEntity({
          name: variant.name,
          label,
          effectType,
          amount,
        }),
    );
  }
}
