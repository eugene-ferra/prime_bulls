import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserService } from '../../user/services/user.service.js';
import { Post } from '../types/Post.type.js';
import { UserHelperService } from '../../user/services/userHelper.service.js';

@Injectable()
export class PostLikeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly userService: UserService,
  ) {}

  async addlike(post: Post, userId: number): Promise<void> {
    if (!(await this.userService.isExists(userId))) throw new BadRequestException('Користувача не знайдено!');

    if (!(await this.isLiked(post, userId)))
      await this.prisma.postLike.create({ data: { postId: post.id, userId } });
  }

  async removeLike(postId: number, userId: number): Promise<void> {
    await this.prisma.postLike.deleteMany({ where: { postId, userId } });
  }

  private async isLiked(post: Post, userId: number): Promise<boolean> {
    return post.likes.some((like) => like.userId === userId);
  }
}
