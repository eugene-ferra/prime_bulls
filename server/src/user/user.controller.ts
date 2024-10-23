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
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { AccessGuard } from '../guards/access.guard.js';
import { UserEntity } from './entities/user.entity.js';
import { UpdateUserPasswordDto } from './dto/updateUserPassword.js';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto.js';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiOkResponse,
  ApiProperty,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';

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

  @ApiOkResponse({ type: UserEntity, description: 'returns user info' })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AccessGuard)
  @UseInterceptors(FileInterceptor('file'), ClassSerializerInterceptor)
  @Patch('/me/avatar')
  async changeAvatar(
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2, message: 'Максимальний розмір файлу - 2 Мб' }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @Req() req,
  ): Promise<UserEntity> {
    const user = await this.userService.updateAvatar(req.user.id, file);

    return new UserEntity(user);
  }

  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: UserEntity, description: 'returns user info' })
  @ApiUnauthorizedResponse()
  @ApiBadRequestResponse()
  @UseGuards(AccessGuard)
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete('/me/avatar')
  async deleteAvatar(@Req() req): Promise<UserEntity> {
    const user = await this.userService.deleteAvatar(req.user.id);

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
