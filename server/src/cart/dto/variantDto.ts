import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';

export class VariantDto {
  @ApiProperty()
  @IsNumber()
  variantNameId: number;

  @ApiProperty()
  @IsNumber()
  variantValueId: number;
}
