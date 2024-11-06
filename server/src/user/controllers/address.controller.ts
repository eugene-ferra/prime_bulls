import {
  Controller,
  UseGuards,
  Req,
  Patch,
  Body,
  Delete,
  Post,
  Param,
  BadRequestException,
} from '@nestjs/common';
import { UserService } from '../services/user.service.js';
import { AccessGuard } from '../../common/guards/access.guard.js';
import { UserEntity } from '../entities/user.entity.js';
import { ApiBadRequestResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { Request } from 'express';
import { UserAddressDto } from '../dto/userAddress.dto.js';
import { UpdateUserAddressDto } from '../dto/updateUserAddress.dto.js';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';

@ApiTags('users')
@UseGuards(AccessGuard)
@ApiUnauthorizedResponse()
@ApiBadRequestResponse()
@ApiSingleResponse(UserEntity)
@Controller('users')
export class AddressController {
  constructor(private readonly userService: UserService) {}

  @Post('/me/address')
  async addAddress(@Req() req: Request, @Body() body: UserAddressDto): Promise<UserEntity> {
    const user = await this.userService.addAddress(req.user.id, body);

    return new UserEntity(user);
  }
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

  @Delete('/me/address/:addressId')
  async deleteAddress(@Req() req: Request, @Param('id') addressId: number): Promise<UserEntity> {
    if (!addressId) throw new BadRequestException('Не корректна адреса!');

    const user = await this.userService.deleteAddress(req.user.id, addressId);

    return new UserEntity(user);
  }
}
