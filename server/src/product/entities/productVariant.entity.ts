import { ApiProperty } from '@nestjs/swagger';

export class ProductVariantEntity {
  @ApiProperty()
  readonly label: string;

  @ApiProperty()
  readonly effectType: string;

  @ApiProperty()
  readonly amount: number;

  @ApiProperty()
  readonly name: string;

  constructor(data: { name: string; label: string; effectType: string; amount: number }) {
    Object.assign(this, data);
  }
}
