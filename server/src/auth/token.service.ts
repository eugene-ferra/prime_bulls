import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { TokenPayloadDto } from './dto/tokenPayload.dto.js';
import { TokensDto } from './dto/tokens.dto.js';

@Injectable()
export class TokenService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async generateTokens(payload: TokenPayloadDto): Promise<TokensDto> {
    const accessToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_ACCESS_SECRET'),
      expiresIn: '15m',
    });

    const refreshToken = await this.jwtService.signAsync(payload, {
      secret: this.configService.getOrThrow('JWT_REFRESH_SECRET'),
      expiresIn: '21d',
    });

    return { accessToken, refreshToken };
  }
}
