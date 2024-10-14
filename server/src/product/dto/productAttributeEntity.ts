import { ApiProperty } from '@nestjs/swagger';

export class TransformedProductAttribute {
  @ApiProperty()
  name: string;

  @ApiProperty()
  value: string;
}

export class AttributeEntity {
  @ApiProperty()
  name: string;
}

export class ProductAttribute {
  id: number;

  @ApiProperty()
  value: string;

  @ApiProperty({ type: () => AttributeEntity })
  attribute?: AttributeEntity;
}
