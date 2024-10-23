import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsStrongPassword } from 'class-validator';

export class UpdateUserPasswordDto {
  @ApiProperty()
  @IsStrongPassword(
    { minLength: 8, minLowercase: 0, minUppercase: 1, minNumbers: 1, minSymbols: 0 },
    {
      message: `Пароль повинен містити мінімум 8 символів, одну велику літеру та одну цифру!`,
    },
  )
  newPassword: string;

  @ApiProperty()
  @IsString({ message: `Обов'язкове поле!` })
  newPasswordConfirm: string;

  @ApiProperty()
  @IsString({ message: `Обов'язкове поле!` })
  oldPassword: string;
}
