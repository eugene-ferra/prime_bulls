import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CartService } from './cart.service.js';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AccessGuard } from '../common/guards/access.guard.js';
import { Request } from 'express';
import { CartItemDto } from './dto/cartItem.dto.js';
import { UpdateCartItemDto } from './dto/updateCartItem.dto.js';
import { CartItemEntity } from './entities/cartItem.entity.js';

@ApiTags('cart')
@UseGuards(AccessGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: [CartItemEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Post()
  async addCartItem(@Req() req: Request, @Body() body: CartItemDto) {
    const cart = await this.cartService.addItem(req.user.id, body);

    return {
      items: cart.items.map((item) => new CartItemEntity(item)),
      newTotalSum: cart.newTotalSum,
      oldTotalSum: cart.oldTotalSum,
    };
  }

  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: [CartItemEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Patch(':productId')
  async updateCartItem(
    @Req() req: Request,
    @Param('productId') productId: number,
    @Body() body: UpdateCartItemDto,
  ) {
    if (!productId) throw new BadRequestException('Товар не знайдено!');

    const cart = await this.cartService.updateItem(req.user.id, productId, body);

    return {
      items: cart.items.map((item) => new CartItemEntity(item)),
      newTotalSum: cart.newTotalSum,
      oldTotalSum: cart.oldTotalSum,
    };
  }

  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: [CartItemEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete(':productId')
  async deleteCartItem(@Req() req: Request, @Param('productId') productId: number) {
    if (!productId) throw new BadRequestException('Товар не знайдено!');

    const cart = await this.cartService.removeItem(req.user.id, productId);

    return {
      items: cart.items.map((item) => new CartItemEntity(item)),
      newTotalSum: cart.newTotalSum,
      oldTotalSum: cart.oldTotalSum,
    };
  }

  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: [CartItemEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Delete()
  async clearCart(@Req() req: Request) {
    const cart = await this.cartService.clearCart(req.user.id);

    return {
      items: cart.items.map((item) => new CartItemEntity(item)),
      newTotalSum: cart.newTotalSum,
      oldTotalSum: cart.oldTotalSum,
    };
  }

  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiOkResponse({ type: [CartItemEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  async getCart(@Req() req: Request) {
    const cart = await this.cartService.find(req.user.id);

    return {
      items: cart.items.map((item) => new CartItemEntity(item)),
      newTotalSum: cart.newTotalSum,
      oldTotalSum: cart.oldTotalSum,
    };
  }
}
