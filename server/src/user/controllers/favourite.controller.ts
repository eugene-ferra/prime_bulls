import { Controller, UseGuards, Req, Delete, Post, Param, BadRequestException } from '@nestjs/common';
import { UserService } from '../services/user.service.js';
import { AccessGuard } from '../../common/guards/access.guard.js';
import { UserEntity } from '../entities/user.entity.js';
import { ApiBadRequestResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';

@ApiTags('users')
@UseGuards(AccessGuard)
@ApiSingleResponse(UserEntity)
@ApiBadRequestResponse()
@ApiUnauthorizedResponse()
@Controller('users')
export class FavouriteController {
  constructor(private readonly userService: UserService) {}

  @Post('/me/favorite/:productId')
  async addFavorite(@Req() req: Request, @Param('productId') productId: number): Promise<UserEntity> {
    if (!productId) throw new BadRequestException('Не корректний товар!');

    const user = await this.userService.addFavorite(req.user.id, productId);

    return new UserEntity(user);
  }

  @Delete('/me/favorite/:productId')
  async removeFavorite(@Req() req: Request, @Param('productId') productId: number): Promise<UserEntity> {
    if (!productId) throw new BadRequestException('Не корректний товар!');

    const user = await this.userService.removeFavorite(req.user.id, productId);

    return new UserEntity(user);
  }
}
