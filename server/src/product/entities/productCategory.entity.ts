import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ImageEntity } from '../../common/entities/image.entity.js';

@Exclude()
export class ProductCategoryEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => new ImageEntity({ url: obj.iconUrl, altText: obj.altText }))
  icon?: ImageEntity;

  constructor(partial: Partial<ProductCategoryEntity>) {
    Object.assign(this, partial);
  }
}
