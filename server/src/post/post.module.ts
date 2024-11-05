import { Module } from '@nestjs/common';
import { PostService } from './services/post.service.js';
import { PostController } from './controllers/post.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { TopicService } from './services/topic.service.js';
import { UserModule } from '../user/user.module.js';
import { PostLikeService } from './services/postLikeService.js';
import { PostViewService } from './services/postViewService.js';
import { PostTopicController } from './controllers/postTopic.controller.js';
import { PostLikesController } from './controllers/postLike.controller.js';

@Module({
  imports: [UserModule],
  controllers: [PostController, PostLikesController, PostTopicController],
  providers: [PostService, PrismaService, TopicService, PostLikeService, PostViewService],
  exports: [PostService],
})
export class PostModule {}
