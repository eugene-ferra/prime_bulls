import { IsNumber, IsString } from 'class-validator';

export class TokenPayloadDto {
  @IsNumber()
  id: number;

  @IsString()
  role: string;
}
