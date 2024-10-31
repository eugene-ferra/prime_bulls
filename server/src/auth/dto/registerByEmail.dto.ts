import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsString, IsStrongPassword, MaxLength, MinLength } from 'class-validator';

export class RegisterByEmailDto {
  @ApiProperty({ required: true })
  @IsString()
  @MinLength(3, { message: "Ім'я повинно містити не менше 3 символів" })
  @MaxLength(30, { message: "Ім'я повинно містити не більше 30 символів" })
  name: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(3, { message: 'Прізвище повинно містити не менше 3 символів' })
  @MaxLength(30, { message: 'Прізвище повинно містити не більше 30 символів' })
  lastName: string;

  @ApiProperty({ required: true })
  @IsEmail({}, { message: 'Некоректний email' })
  email: string;

  @ApiProperty({ required: true })
  @IsStrongPassword(
    {},
    {
      message:
        'Пароль повинен містити мінімум 8 символів, одну велику літеру, одну цифру та один спеціальний символ',
    },
  )
  password: string;
}
