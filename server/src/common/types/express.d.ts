import CurrentUserDto from '../dto/currentUser.dto.ts';

declare module 'express' {
  export interface Request {
    user?: CurrentUserDto;
  }
}
