import {
  Controller,
  Get,
  UseGuards,
  Req,
  UseInterceptors,
  Patch,
  Body,
  Delete,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  Post,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from './user.service.js';
import { AccessGuard } from '../common/guards/access.guard.js';
import { UserEntity } from './entities/user.entity.js';
import { UpdateUserPasswordDto } from './dto/updateUserPassword.dto.js';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto.js';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConflictResponse,
  ApiConsumes,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { UserAddressDto } from './dto/userAddress.dto.js';
import { UpdateUserAddressDto } from './dto/updateUserAddress.dto.js';

@ApiTags('users')
@UseGuards(AccessGuard)
@ApiUnauthorizedResponse()
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiOkResponse({ type: UserEntity })
  @Get('/me')
  async getMe(@Req() req: Request): Promise<UserEntity> {
    const user = await this.userService.findById(req.user.id);

    return new UserEntity(user);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse()
  @Patch('/me/password')
  async changePassword(@Req() req: Request, @Body() body: UpdateUserPasswordDto): Promise<UserEntity> {
    const user = await this.userService.updatePassword(req.user.id, body);

    return new UserEntity(user);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse()
  @Patch('/me/info')
  async changeInfo(@Req() req: Request, @Body() body: UpdateUserInfoDto): Promise<UserEntity> {
    const user = await this.userService.updateInfo(req.user.id, body);

    return new UserEntity(user);
  }

  @ApiOkResponse({ type: UserEntity })
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
  @UseInterceptors(FileInterceptor('file'))
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
    @Req() req: Request,
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
  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse()
  @Delete('/me/avatar')
  async deleteAvatar(@Req() req: Request): Promise<UserEntity> {
    const user = await this.userService.deleteAvatar(req.user.id);

    return new UserEntity(user);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse()
  @Post('/me/address')
  async addAddress(@Req() req: Request, @Body() body: UserAddressDto): Promise<UserEntity> {
    const user = await this.userService.addAddress(req.user.id, body);

    return new UserEntity(user);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse()
  @Patch('/me/address/:addressId')
  async updateAddress(
    @Req() req: Request,
    @Body() body: UpdateUserAddressDto,
    @Param('id') addressId: number,
  ): Promise<UserEntity> {
    if (!addressId) throw new BadRequestException('Не корректна адреса!');

    const user = await this.userService.updateAddress(req.user.id, addressId, body);

    return new UserEntity(user);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse()
  @Delete('/me/address/:addressId')
  async deleteAddress(@Req() req: Request, @Param('id') addressId: number): Promise<UserEntity> {
    if (!addressId) throw new BadRequestException('Не корректна адреса!');

    const user = await this.userService.deleteAddress(req.user.id, addressId);

    return new UserEntity(user);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @Post('/me/favorite/:productId')
  async addFavorite(@Req() req: Request, @Param('productId') productId: number): Promise<UserEntity> {
    if (!productId) throw new BadRequestException('Не корректний товар!');

    const user = await this.userService.addFavorite(req.user.id, productId);

    return new UserEntity(user);
  }

  @ApiOkResponse({ type: UserEntity })
  @ApiBadRequestResponse()
  @ApiConflictResponse()
  @Delete('/me/favorite/:productId')
  async removeFavorite(@Req() req: Request, @Param('productId') productId: number): Promise<UserEntity> {
    if (!productId) throw new BadRequestException('Не корректний товар!');

    const user = await this.userService.removeFavorite(req.user.id, productId);

    return new UserEntity(user);
  }

  @ApiOkResponse()
  @Delete('/me')
  async deleteMe(@Req() req: Request): Promise<UserEntity> {
    await this.userService.delete(req.user.id);

    return;
  }
}
