import { Response } from 'express';

export function clearAuthCookies(res: Response) {
  res.clearCookie('refreshToken');
  res.clearCookie('accessToken');
}
