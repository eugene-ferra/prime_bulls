import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, Min } from 'class-validator';
import { VariantDto } from './variantDto.js';

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
  @IsArray()
  variants?: VariantDto[];
}
