import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { FileModule } from '../file/file.module.js';
import { ProductModule } from '../product/product.module.js';

@Module({
  imports: [FileModule, ProductModule],
  controllers: [UserController],
  providers: [PrismaService, UserService],
  exports: [UserService],
})
export class UserModule {}
