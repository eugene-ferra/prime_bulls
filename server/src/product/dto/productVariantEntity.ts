import { ApiProperty } from '@nestjs/swagger';

class VariantValue {
  @ApiProperty()
  label: string;

  @ApiProperty()
  effectType: string;

  @ApiProperty()
  amount: number;
}

export class VariantEntity {
  id: number;

  @ApiProperty()
  name: string;
}

export class TransformedProductVariant {
  @ApiProperty()
  variant: string;

  @ApiProperty({ type: () => [VariantValue] })
  values: VariantValue[];
}

export class ProductVariantEntity {
  id: number;

  @ApiProperty()
  label: string;

  @ApiProperty()
  effectType: string;

  @ApiProperty()
  amount: number;

  @ApiProperty({ type: () => VariantEntity })
  variant?: VariantEntity;
}
