import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ProductImageEntity {
  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  altText: string;

  constructor(partial: Partial<{ url: string; altText: string }>) {
    Object.assign(this, partial);
  }
}
