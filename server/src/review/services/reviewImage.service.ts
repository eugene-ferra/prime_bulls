import { Injectable } from '@nestjs/common';
import { ImageService } from '../../file/image.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { Review } from '../types/review.type.js';

@Injectable()
export class ReviewImageService {
  constructor(
    private readonly imageService: ImageService,
    private readonly prismaService: PrismaService,
  ) {}

  private folder = 'reviews';

  async saveImages(files: Express.Multer.File[], reviewId: number): Promise<void> {
    const images = await Promise.all(
      files.map((file) =>
        this.imageService.saveImage(file, this.folder, reviewId, file.originalname, {
          width: 800,
          fit: 'contain',
        }),
      ),
    );

    await this.prismaService.reviewImage.createMany({
      data: images.map(({ url, mime }, i) => ({
        reviewId,
        url,
        mimeType: mime,
        altText: `${reviewId}-${i}`,
      })),
    });
  }

  async removeImages(review: Review): Promise<void> {
    await Promise.all([
      review.images.map((image) => this.imageService.deleteImage(this.folder, image.url)),
      this.prismaService.reviewImage.deleteMany({ where: { reviewId: review.id } }),
    ]);
  }
}
