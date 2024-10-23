import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty()
  @IsStrongPassword()
  newPassword: string;

  @ApiProperty()
  @IsString()
  newPasswordConfirm: string;

  @ApiProperty()
  @IsString()
  oldPassword: string;
}
