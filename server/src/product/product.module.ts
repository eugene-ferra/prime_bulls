import { Module } from '@nestjs/common';
import { ProductService } from './services/product.service.js';
import { ProductController } from './controllers/product.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CategoryService } from './services/category.service.js';
import { CategoryController } from './controllers/category.controller.js';

@Module({
  controllers: [ProductController, CategoryController],
  providers: [PrismaService, CategoryService, ProductService],
  exports: [ProductService],
})
export class ProductModule {}
