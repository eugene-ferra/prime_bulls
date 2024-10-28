import { IsIn, IsInt, IsOptional, Min } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class BaseFilterDto {
  @ApiPropertyOptional({ description: 'Page number for pagination' })
  @IsOptional()
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Number of items per page' })
  @IsOptional()
  @IsInt()
  @Min(1)
  limit?: number;

  @ApiPropertyOptional({ enum: ['createdAt'], description: 'Field to order by' })
  @IsOptional()
  @IsIn(['createdAt'])
  orderBy?: string;

  @ApiPropertyOptional({ enum: ['asc', 'desc'], description: 'Order direction' })
  @IsOptional()
  @IsIn(['asc', 'desc'])
  orderMode?: string;
}
