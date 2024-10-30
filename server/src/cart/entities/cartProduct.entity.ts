import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { CartProductVariantEntity } from './cartProductVariant.entity.js';

@Exclude()
export class CartProductEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  subtitle: string;

  @ApiProperty()
  @Expose()
  basePrice: number;

  @ApiProperty()
  @Expose()
  salePercent: number;

  @ApiProperty({ type: () => ImageEntity })
  @Expose()
  @Transform(({ obj }) => new ImageEntity({ url: obj.coverImageUrl, altText: obj.coverImageAltText }))
  coverImage?: ImageEntity;

  @ApiProperty({ type: () => [CartProductVariantEntity] })
  @Expose()
  @Transform(({ value }) => value.map((item: CartProductVariantEntity) => new CartProductVariantEntity(item)))
  productVariants?: CartProductVariantEntity[];

  constructor(partial: Partial<CartProductEntity>) {
    Object.assign(this, partial);
  }
}
