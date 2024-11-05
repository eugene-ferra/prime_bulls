import { Injectable } from '@nestjs/common';
import { DeviceDto } from '../../common/dto/device.dto.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Post } from '../types/Post.type.js';

@Injectable()
export class PostViewService {
  constructor(private readonly prisma: PrismaService) {}

  async addView(post: Post, device: DeviceDto): Promise<void> {
    const { ip, userAgent } = device;

    if (await this.isViewed(post, ip, userAgent)) return;

    await this.prisma.view.create({ data: { postId: post.id, ip, userAgent } });
  }

  private async isViewed(post: Post, ip: string, userAgent: string): Promise<boolean> {
    return post.views.some((view) => view.ip === ip && view.userAgent === userAgent);
  }
}
