import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ProductVariantEntity {
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
  @Transform(({ value }) => value.name)
  @Expose()
  variant?: string;

  constructor(partial: Partial<ProductVariantEntity>) {
    Object.assign(this, partial);
  }
}
