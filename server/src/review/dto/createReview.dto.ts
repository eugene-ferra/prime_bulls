import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsNumber, IsOptional, IsString } from 'class-validator';

export class CreateReviewDto {
  @ApiProperty()
  @IsNumber()
  productId: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsIn([1, 2, 3, 4, 5])
  rating?: number;

  @ApiProperty()
  @IsString()
  comment: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNumber()
  parentReviewId?: number;
}
