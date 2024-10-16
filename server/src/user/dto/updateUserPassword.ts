import { ApiProperty } from '@nestjs/swagger';
import { IsStrongPassword } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty()
  @IsStrongPassword()
  newPassword: string;

  @ApiProperty()
  @IsStrongPassword()
  newPasswordConfirm: string;

  @ApiProperty()
  @IsStrongPassword()
  oldPassword: string;
}
