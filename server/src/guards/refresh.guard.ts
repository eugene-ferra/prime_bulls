import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class RefreshGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = this.extractRefreshToken(request);
    if (!token) {
      throw new UnauthorizedException('No token provided');
    }
    try {
      await this.jwtService.verifyAsync(token, {
        secret: this.configService.getOrThrow('JWT_REFRESG_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Invalid token');
    }
    return true;
  }

  private extractRefreshToken(request: Request): string | null {
    const accessToken = request.cookies['refreshToken'] || null;
    return accessToken;
  }
}
