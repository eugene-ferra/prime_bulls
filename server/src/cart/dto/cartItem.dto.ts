import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, Min, ValidateNested } from 'class-validator';
import { VariantDto } from './variantDto.js';
import { Type } from 'class-transformer';

export class CartItemDto {
  @ApiProperty()
  @IsNumber()
  @Min(1, { message: 'Потрібно додати хоча б один товар!' })
  quantity: number;

  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiPropertyOptional({ type: [VariantDto] })
  @IsOptional()
  @ValidateNested({ each: true, message: 'Неправильні опції товару!' })
  @Type(() => VariantDto)
  variants?: VariantDto[];
}
