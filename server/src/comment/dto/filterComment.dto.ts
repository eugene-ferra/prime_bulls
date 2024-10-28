import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { BaseFilterDto } from '../../common/dto/baseFIlter.dto.js';
export class FilterCommentsDto extends BaseFilterDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Некорректна стаття' })
  postId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Некорректний користувач' })
  userId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber({}, { message: 'Некорректний коментар' })
  parentCommentId?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean({ message: 'Некорректний статус модерації' })
  isModerated?: boolean;
}
