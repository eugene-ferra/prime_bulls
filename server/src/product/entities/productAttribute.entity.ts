import { ApiProperty } from '@nestjs/swagger';

export class ProductAttributeEntity {
  @ApiProperty()
  value?: string;

  @ApiProperty()
  name: string;

  constructor(data: { value: string; name: string }) {
    Object.assign(this, data);
  }
}
