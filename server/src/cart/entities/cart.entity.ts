import { ApiProperty } from '@nestjs/swagger';
import { Cart } from '../types/cart.type.js';
import { CartItemEntity } from './cartItem.entity.js';

export class CartEntity {
  items: CartItemEntity[];

  @ApiProperty()
  actualSum: number;

  @ApiProperty()
  oldSum: number;

  constructor(cart: Cart) {
    this.actualSum = cart.actualSum;
    this.oldSum = cart.oldSum;
    this.items = cart.items.map((item) => new CartItemEntity(item));
  }
}
