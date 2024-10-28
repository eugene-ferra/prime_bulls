import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ProductCategoryEntity } from './productCategory.entity.js';
import { ImageEntity } from '../../common/entities/image.entity.js';

@Exclude()
export class SimpleProductEntity {
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
  @Transform(({ value }) => new ProductCategoryEntity(value))
  category: ProductCategoryEntity;

  @ApiProperty()
  @Expose()
  basePrice: number;

  @ApiProperty()
  @Expose()
  salePercent: number;

  @ApiProperty({ type: () => ImageEntity })
  @Expose()
  @Transform(({ obj }) => new ImageEntity({ url: obj.coverImageUrl, altText: obj.coverImageAltText }))
  coverImage: ImageEntity;

  // TODO: add reviews data

  constructor(partial: Partial<SimpleProductEntity>) {
    Object.assign(this, partial);
  }
}
