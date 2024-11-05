import { Module } from '@nestjs/common';
import { CommentService } from './services/comment.service.js';
import { CommentController } from './controllers/comment.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PostModule } from '../post/post.module.js';
import { UserModule } from '../user/user.module.js';
import { CommentLikesController } from './controllers/commentLike.controller.js';
import { CommentLikeService } from './services/commentLike.service.js';

@Module({
  imports: [PostModule, UserModule],
  controllers: [CommentController, CommentLikesController],
  providers: [PrismaService, CommentService, CommentLikeService],
  exports: [CommentService],
})
export class CommentModule {}
