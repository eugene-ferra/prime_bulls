import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ImageService } from '../../file/image.service.js';
import slugify from 'slugify';
import { UserHelperService } from './userHelper.service.js';

@Injectable()
export class AvatarService {
  constructor(
    private prisma: PrismaService,
    private minioService: ImageService,
    private userHelper: UserHelperService,
  ) {}

  private folder = 'users';

  async updateAvatar(userId: number, file: Express.Multer.File): Promise<void> {
    const user = await this.userHelper.findById(userId);
    if (!user) throw new NotFoundException('Користувача не знайдено!');

    if (user.imageUrl) await this.minioService.deleteImage(this.folder, user.imageUrl);

    const savedImageName = slugify.default(`${user.id}-${user.name}-${Date.now()}`, { lower: true });
    const savedImage = await this.minioService.saveImage(file, {
      bucketName: this.folder,
      id: user.id,
      options: { width: 400, height: 400, fit: 'cover' },
    });

    await this.prisma.user.update({
      where: { id: user.id },
      data: { imageUrl: savedImage.url, mimeType: savedImage.mime, altText: savedImageName },
    });
  }

  async deleteAvatar(userId: number): Promise<void> {
    const user = await this.userHelper.findById(userId);
    if (!user) throw new NotFoundException('Користувача не знайдено!');

    if (user.imageUrl) await this.minioService.deleteImage(this.folder, user.imageUrl);

    await this.prisma.user.update({
      where: { id: user.id },
      data: { imageUrl: null, mimeType: null, altText: null },
    });
  }
}
