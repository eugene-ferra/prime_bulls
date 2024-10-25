import { Module } from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { ReviewController } from './review.controller.js';
import { UserModule } from '../user/user.module.js';
import { ProductModule } from '../product/product.module.js';
import { MinioClientModule } from '../minio/minio.module.js';
import { PrismaService } from '../prisma-service/prisma-service.service.js';

@Module({
  imports: [UserModule, ProductModule, MinioClientModule],
  controllers: [ReviewController],
  providers: [PrismaService, ReviewService],
})
export class ReviewModule {}
