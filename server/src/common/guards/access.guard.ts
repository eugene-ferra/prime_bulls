import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import CurrentUserDto from '../dto/currentUser.dto.js';

@Injectable()
export class AccessGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractAccessToken(request);
    if (!token) {
      throw new UnauthorizedException('No access token provided!');
    }
    try {
      const payload: CurrentUserDto = await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      });

      request.user = payload;
    } catch {
      throw new UnauthorizedException('Invalid access token!');
    }
    return true;
  }

  private extractAccessToken(request: Request): string | null {
    const accessToken = request.cookies['accessToken'] || null;
    return accessToken;
  }
}
