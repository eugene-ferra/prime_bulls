import { ApiProperty } from '@nestjs/swagger';

export class PostImageEntity {
  @ApiProperty()
  url: string;

  @ApiProperty()
  altText: string;
}
