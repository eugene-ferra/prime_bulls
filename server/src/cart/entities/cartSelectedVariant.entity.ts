import { ApiProperty } from '@nestjs/swagger';
import { CartSelectedVariant } from '../types/cartSelectedVariant.type.js';

export class CartSelectedVariantEntity {
  @ApiProperty()
  label: string;

  @ApiProperty()
  effectType: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  name: string;

  constructor(data: CartSelectedVariant) {
    this.label = data.variantValue.label;
    this.effectType = data.variantValue.effectType;
    this.amount = data.variantValue.amount;
    this.name = data.variantName.name;
  }
}
