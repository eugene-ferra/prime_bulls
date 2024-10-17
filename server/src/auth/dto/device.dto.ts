import { IsNumber, IsString } from 'class-validator';

export class DeviceDto {
  @IsString()
  ip: string;

  @IsString()
  userAgent: string;
}
