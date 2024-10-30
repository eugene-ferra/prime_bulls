import { Module } from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { CommentController } from './comment.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PostModule } from '../post/post.module.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [PostModule, UserModule],
  controllers: [CommentController],
  providers: [PrismaService, CommentService],
  exports: [CommentService],
})
export class CommentModule {}