import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service.js';
import { ApiBadRequestResponse, ApiOkResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { AccessGuard } from '../common/guards/access.guard.js';
import { Request } from 'express';
import { CartItemDto } from './dto/cartItem.dto.js';
import { UpdateCartItemDto } from './dto/updateCartItem.dto.js';
import { CartEntity } from './entities/cart.entity.js';

@ApiTags('cart')
@UseGuards(AccessGuard)
@ApiBadRequestResponse()
@ApiUnauthorizedResponse()
@ApiOkResponse({ type: CartEntity })
@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  async addCartItem(@Req() req: Request, @Body() body: CartItemDto) {
    const cart = await this.cartService.addItem(req.user.id, body);

    return new CartEntity(cart);
  }

  @Patch(':productId')
  async updateCartItem(
    @Req() req: Request,
    @Param('productId') productId: number,
    @Body() body: UpdateCartItemDto,
  ) {
    if (!productId) throw new BadRequestException('Товар не знайдено!');

    const cart = await this.cartService.updateItem(req.user.id, productId, body);

    return new CartEntity(cart);
  }

  @Delete(':productId')
  async deleteCartItem(@Req() req: Request, @Param('productId') productId: number) {
    if (!productId) throw new BadRequestException('Товар не знайдено!');

    const cart = await this.cartService.removeItem(req.user.id, productId);

    return new CartEntity(cart);
  }

  @Delete()
  async clearCart(@Req() req: Request) {
    const cart = await this.cartService.clearCart(req.user.id);

    return new CartEntity(cart);
  }

  @Get('/')
  async getCart(@Req() req: Request) {
    const cart = await this.cartService.find(req.user.id);

    return new CartEntity(cart);
  }
}
