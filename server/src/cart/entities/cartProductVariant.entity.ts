import { ApiProperty } from '@nestjs/swagger';
import { CartProductVariant } from '../types/cartProductVariant.type.js';

export class CartProductVariantEntity {
  @ApiProperty()
  label: string;

  @ApiProperty()
  effectType: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  name: string;

  constructor(data: CartProductVariant) {
    this.label = data.label;
    this.effectType = data.effectType;
    this.amount = data.amount;
    this.name = data.variant.name;
  }
}
