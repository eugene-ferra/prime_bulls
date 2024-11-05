import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserService } from '../../user/user.service.js';
import { Comment } from '../types/comment.type.js';

@Injectable()
export class CommentLikeService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly userService: UserService,
  ) {}

  async addlike(comment: Comment, userId: number): Promise<void> {
    const user = await this.userService.findById(userId);
    if (!user) throw new BadRequestException('Користувача не знайдено!');

    if (!(await this.isLiked(comment, userId)))
      await this.prismaService.commentLike.create({ data: { commentId: comment.id, userId } });
  }

  async removeLike(commentId: number, userId: number): Promise<void> {
    await this.prismaService.commentLike.deleteMany({ where: { commentId, userId } });
  }

  private async isLiked(comment: Comment, userId: number): Promise<boolean> {
    return comment.likes.some((like) => like.userId === userId);
  }
}
