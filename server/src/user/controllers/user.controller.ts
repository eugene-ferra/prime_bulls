import { Controller, Get, UseGuards, Req, Patch, Body, Delete } from '@nestjs/common';
import { UserService } from '../services/user.service.js';
import { AccessGuard } from '../../common/guards/access.guard.js';
import { UserEntity } from '../entities/user.entity.js';
import { UpdateUserPasswordDto } from '../dto/updateUserPassword.dto.js';
import { UpdateUserInfoDto } from '../dto/updateUserInfo.dto.js';
import { ApiBadRequestResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';

@ApiTags('users')
@UseGuards(AccessGuard)
@ApiUnauthorizedResponse()
@ApiSingleResponse(UserEntity)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/me')
  async getMe(@Req() req: Request): Promise<UserEntity> {
    const user = await this.userService.findOne(req.user.id);

    return new UserEntity(user);
  }

  @ApiBadRequestResponse()
  @Patch('/me/password')
  async changePassword(@Req() req: Request, @Body() body: UpdateUserPasswordDto): Promise<UserEntity> {
    const user = await this.userService.updatePassword(req.user.id, body);

    return new UserEntity(user);
  }

  @ApiBadRequestResponse()
  @Patch('/me/info')
  async changeInfo(@Req() req: Request, @Body() body: UpdateUserInfoDto): Promise<UserEntity> {
    const user = await this.userService.updateInfo(req.user.id, body);

    return new UserEntity(user);
  }

  @Delete('/me')
  async deleteMe(@Req() req: Request): Promise<UserEntity> {
    await this.userService.delete(req.user.id);

    return;
  }
}
