import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from '../../common/dto/baseFIlter.dto.js';
export class FilterCommentsDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  postId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  userId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  parentCommentId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  isModerated?: boolean;
}
