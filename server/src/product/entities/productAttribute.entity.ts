import { ApiProperty } from '@nestjs/swagger';

export class ProductAttributeEntity {
  @ApiProperty()
  readonly value: string;

  @ApiProperty()
  readonly name: string;

  constructor(data: { value: string; name: string }) {
    Object.assign(this, data);
  }
}
