import { ApiProperty } from '@nestjs/swagger';
import { CartItem } from '../types/cartItem.type.js';
import { CartProductEntity } from './cartProduct.entity.js';
import { CartProductVariantEntity } from './cartProductVariant.entity.js';
import { CartSelectedVariant } from '../types/cartSelectedVariant.type.js';
import { CartSelectedVariantEntity } from './cartSelectedVariant.entity.js';

export class CartItemEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  product: CartProductEntity;

  @ApiProperty()
  selectedVariants: CartSelectedVariantEntity[];

  @ApiProperty()
  newPrice: number;

  @ApiProperty()
  oldPrice: number;

  constructor(data: CartItem) {
    this.id = data.id;
    this.quantity = data.quantity;
    this.newPrice = data.actualPrice;
    this.oldPrice = data.oldPrice;
    this.product = new CartProductEntity(data.product);
    this.selectedVariants = data.cartItemVariants.map((variant) => new CartSelectedVariantEntity(variant));
  }
}
