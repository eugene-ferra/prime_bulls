import { Module } from '@nestjs/common';
import { PostService } from './post.service.js';
import { PostController } from './post.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TopicService } from './topic.service.js';
import { UserModule } from '../user/user.module.js';

@Module({
  imports: [UserModule],
  controllers: [PostController],
  providers: [PostService, PrismaService, TopicService],
  exports: [PostService],
})
export class PostModule {}
