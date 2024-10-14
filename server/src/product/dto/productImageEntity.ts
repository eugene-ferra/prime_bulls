import { ApiProperty } from '@nestjs/swagger';

export class ProductImageEntity {
  @ApiProperty()
  url: string;

  @ApiProperty()
  altText: string;
}
