import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { CartProductVariantEntity } from './cartProductVariant.entity.js';
import { CartProduct } from '../types/cartProduct.type.js';

@Exclude()
export class CartProductEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  basePrice: number;

  @ApiProperty()
  salePercent: number;

  @ApiProperty({ type: ImageEntity })
  coverImage: ImageEntity;

  @ApiProperty()
  productVariants: CartProductVariantEntity[];

  constructor(data: CartProduct) {
    this.id = data.id;
    this.title = data.title;
    this.slug = data.slug;
    this.basePrice = data.basePrice;
    this.salePercent = data.salePercent;
    this.coverImage = new ImageEntity({ url: data.coverImageUrl, altText: data.coverImageAltText });
    this.productVariants = data.productVariants?.map((variant) => new CartProductVariantEntity(variant));
  }
}
