import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CartVariantEntity {
  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.variantValue.label)
  label: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.variantValue.effectType)
  effectType: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.variantValue.amount)
  amount: number;

  @ApiProperty()
  @Transform(({ obj }) => obj.variantName)
  @Expose()
  variant?: any;

  constructor(partial: Partial<CartVariantEntity>) {
    Object.assign(this, partial);
  }
}
