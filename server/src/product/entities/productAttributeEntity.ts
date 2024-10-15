import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';

@Exclude()
export class ProductAttributeEntity {
  @ApiProperty()
  @Expose()
  value: string;

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.attribute.name)
  name?: string;

  constructor(partial: Partial<ProductAttributeEntity>) {
    Object.assign(this, partial);
  }
}
