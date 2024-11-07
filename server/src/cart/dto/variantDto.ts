import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class VariantDto {
  @ApiProperty()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 }, { message: 'Некорректний id' })
  nameId: number;

  @ApiProperty()
  @IsNumber({ allowNaN: false, allowInfinity: false, maxDecimalPlaces: 0 }, { message: 'Некорректний id' })
  valueId: number;
}
