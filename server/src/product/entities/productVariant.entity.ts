import { ApiProperty } from '@nestjs/swagger';

export class ProductVariantEntity {
  @ApiProperty()
  label: string;

  @ApiProperty()
  effectType: string;

  @ApiProperty()
  amount: number;

  @ApiProperty()
  name: string;

  constructor(data: { name: string; label: string; effectType: string; amount: number }) {
    Object.assign(this, data);
  }
}
