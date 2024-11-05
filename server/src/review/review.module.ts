import { Module } from '@nestjs/common';
import { ReviewService } from './services/review.service.js';
import { ReviewController } from './controllers/review.controller.js';
import { UserModule } from '../user/user.module.js';
import { ProductModule } from '../product/product.module.js';
import { FileModule } from '../file/file.module.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ReviewLikeController } from './controllers/reviewLikes.controller.js';
import { ReviewLikeService } from './services/reviewLike.service.js';
import { ReviewImageService } from './services/reviewImage.service.js';

@Module({
  imports: [ProductModule, UserModule, FileModule],
  controllers: [ReviewController, ReviewLikeController],
  providers: [PrismaService, ReviewService, ReviewLikeService, ReviewImageService],
})
export class ReviewModule {}
