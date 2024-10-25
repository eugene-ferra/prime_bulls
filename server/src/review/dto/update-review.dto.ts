import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsIn, IsOptional, IsString } from 'class-validator';

export class UpdateReviewDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsIn([1, 2, 3, 4, 5])
  rating?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  comment?: string;
}
