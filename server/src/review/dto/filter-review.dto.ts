import { IsBoolean, IsIn, IsInt, IsNumber, IsOptional, Min } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FilterReviewDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  productId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  parentReviewId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isModerated?: boolean;

  @ApiPropertyOptional({ enum: ['createdAt'] })
  @IsOptional()
  @IsIn(['createdAt'])
  orderBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'] })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderMode?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;
}
