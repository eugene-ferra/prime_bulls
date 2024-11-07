import { Module } from '@nestjs/common';
import { CartService } from './cart.service.js';
import { CartController } from './cart.controller.js';
import { UserModule } from '../user/user.module.js';
import { ProductModule } from '../product/product.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CartRepositoryService } from './services/cartRepository.service.js';

@Module({
  imports: [UserModule, ProductModule],
  controllers: [CartController],
  providers: [PrismaService, CartService, CartRepositoryService],
})
export class CartModule {}
