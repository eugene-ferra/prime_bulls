import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class UpdateUserAddressDto {
  @ApiPropertyOptional()
  @IsString()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  street?: string;

  @ApiPropertyOptional()
  @IsString()
  houseNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  flatNumber?: string;
}
