import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
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

  @ApiPropertyOptional()
  @IsOptional()
  minPrice?: number;

  @ApiPropertyOptional()
  @IsOptional()
  maxPrice?: number;

  // TODO: add sorting by rating

  @ApiPropertyOptional({ enum: ['basePrice', 'createdAt'] })
  @IsOptional()
  @IsIn(['basePrice', 'createdAt'])
  declare orderBy?: string;
}
