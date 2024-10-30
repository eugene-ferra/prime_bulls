import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class CartProductVariantEntity {
  @ApiProperty()
  @Expose()
  label: string;

  @Expose()
  @ApiProperty()
  effectType: string;

  @Expose()
  @ApiProperty()
  amount: number;

  @ApiProperty()
  @Expose()
  variant?: any;

  constructor(partial: Partial<CartProductVariantEntity>) {
    Object.assign(this, partial);
  }
}
