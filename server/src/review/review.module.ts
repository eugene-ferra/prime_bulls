import { Module } from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { ReviewController } from './review.controller.js';
import { UserModule } from '../user/user.module.js';
import { ProductModule } from '../product/product.module.js';
import { FileModule } from '../file/file.module.js';
import { PrismaService } from '../prisma/prisma.service.js';

@Module({
  imports: [UserModule, ProductModule, FileModule],
  controllers: [ReviewController],
  providers: [PrismaService, ReviewService],
})
export class ReviewModule {}
