import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { DeviceDto } from '../dto/device.dto.js';

export const Device = createParamDecorator((data: unknown, ctx: ExecutionContext): DeviceDto => {
  const request = ctx.switchToHttp().getRequest();
  const ip = request.ip || request.headers['x-forwarded-for'] || request.connection.remoteAddress;
  const userAgent = request.headers['user-agent'];

  return { ip, userAgent };
});
