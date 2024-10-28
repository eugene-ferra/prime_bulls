import { Module } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { ProductController } from './product.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CategoryService } from './category.service.js';

@Module({
  controllers: [ProductController],
  providers: [PrismaService, CategoryService, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
