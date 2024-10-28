import { Type } from 'class-transformer';
import { IsArray, IsBoolean, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { BaseFilterDto } from '../../common/dto/baseFIlter.dto.js';

export class FilterProductsDto extends BaseFilterDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  title?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  subtitle?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  categoryId?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  slug?: string;

  @ApiProperty({ required: false, type: [Number, Number] })
  @IsOptional()
  @Type(() => JSON.parse)
  @IsArray()
  basePrice?: [number, number];

  @ApiProperty({ required: false, type: [Number, Number] })
  @IsOptional()
  @IsArray()
  @Type(() => Number)
  salePercent?: [number, number];

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  // TODO: add sorting by rating

  @ApiPropertyOptional({ enum: ['basePrice', 'createdAt'] })
  @IsOptional()
  @IsIn(['basePrice', 'createdAt'])
  declare orderBy?: string;
}
