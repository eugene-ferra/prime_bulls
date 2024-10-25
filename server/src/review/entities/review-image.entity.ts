import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class ReviewImageEntity {
  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  altText: string;

  constructor(partial: { url: string; altText: string }) {
    Object.assign(this, partial);
  }
}
