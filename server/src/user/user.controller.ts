import { Controller, Get, Post, Body } from '@nestjs/common';
import { UserService } from './user.service.js';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  // TODO: implement get, post, patch delete endpoints after adding jwt auth
}
