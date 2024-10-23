import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsOptional, IsPhoneNumber, IsString, MaxLength, Min, MinLength } from 'class-validator';

export class UpdateUserInfoDto {
  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2, { message: `Ім'я повинно містити мінімум 2 символи!` })
  @MaxLength(30, { message: `Ім'я повинно містити максимум 30 символів!` })
  name?: string;

  @ApiProperty()
  @IsOptional()
  @IsString()
  @MinLength(2, { message: `Прізвище повинно містити мінімум 2 символи!` })
  @MaxLength(30, { message: `Прізвище повинно містити максимум 30 символів!` })
  lastName?: string;

  @ApiProperty()
  @IsOptional()
  @IsEmail({}, { message: 'Некоректний email!' })
  email?: string;

  @ApiProperty()
  @IsOptional()
  @IsPhoneNumber('UA', { message: 'Некоректний номер телефону!' })
  phone?: string;
}
