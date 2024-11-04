import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ImageEntity {
  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  altText: string;

  constructor(data: { url: string; altText: string }) {
    Object.assign(this, data);
  }
}
