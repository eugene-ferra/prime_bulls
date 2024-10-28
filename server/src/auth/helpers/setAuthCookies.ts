import { Response } from 'express';
import { TokensDto } from '../dto/tokens.dto.js';

export function setAuthCookies(res: Response, tokens: TokensDto) {
  res.cookie('refreshToken', tokens.refreshToken, {
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  });

  res.cookie('accessToken', tokens.accessToken, {
    httpOnly: true,
    secure: false,
    expires: new Date(Date.now() + 1000 * 60 * 15),
  });
}
