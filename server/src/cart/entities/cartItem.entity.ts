import { Exclude, Expose, Transform } from 'class-transformer';
import { CartProductEntity } from './cartProduct.entity.js';
import { ApiProperty } from '@nestjs/swagger';
import { CartProductVariantEntity } from './cartProductVariant.entity.js';
import { CartVariantEntity } from './cartVariant.entity.js';

@Exclude()
export class CartItemEntity {
  @Expose()
  id: number;

  @Expose()
  quantity: number;

  @Expose()
  @Transform(({ obj }) => new CartProductEntity(obj.product))
  product?: CartProductEntity;

  @ApiProperty({ type: () => [CartVariantEntity] })
  @Expose()
  @Transform(({ value }) => value.map((item) => new CartVariantEntity(item)))
  cartItemVariants?: any[];

  @ApiProperty()
  @Expose()
  newPrice: number;

  @ApiProperty()
  @Expose()
  oldPrice?: number;

  constructor(partial: Partial<CartItemEntity>) {
    Object.assign(this, partial);
  }
}
