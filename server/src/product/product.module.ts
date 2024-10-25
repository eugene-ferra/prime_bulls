import { Module } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { PrismaService } from '../prisma-service/prisma-service.service.js';

@Module({
  controllers: [ProductController],
  providers: [PrismaService, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
