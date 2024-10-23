import {
  Controller,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
  ClassSerializerInterceptor,
  Patch,
  Body,
  Delete,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { AccessGuard } from '../guards/access.guard.js';
import { UserEntity } from './entities/user.entity.js';
import { UpdateUserPasswordDto } from './dto/updateUserPassword.js';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto.js';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';

@ApiTags('users')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: UserEntity, description: 'returns user info' })
  @ApiUnauthorizedResponse()
  @UseGuards(AccessGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/me')
  async getMe(@Req() req): Promise<UserEntity> {
    const user = await this.userService.findById(req.user.id);

    return new UserEntity(user);
  }

  @ApiOkResponse({ type: UserEntity, description: 'returns user info' })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AccessGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/me/password')
  async changePassword(@Req() req, @Body() body: UpdateUserPasswordDto): Promise<UserEntity> {
    const user = await this.userService.updatePassword(req.user.id, body);

    return new UserEntity(user);
  }

  @ApiOkResponse({ type: UserEntity, description: 'returns user info' })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AccessGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch('/me/info')
  async changeInfo(@Req() req, @Body() body: UpdateUserInfoDto): Promise<UserEntity> {
    const user = await this.userService.updateInfo(req.user.id, body);

    return new UserEntity(user);
  }

  @ApiOkResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(AccessGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/me')
  async deleteMe(@Req() req): Promise<UserEntity> {
    await this.userService.delete(req.user.id);

    return;
  }
}
