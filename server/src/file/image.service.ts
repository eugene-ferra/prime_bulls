import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import sharp from 'sharp';

@Injectable()
export class ImageService {
  constructor(private readonly minioService: MinioService) {}

  async saveImage(
    image: Express.Multer.File,
    bucketName: string,
    id: number,
    fileName: string,
    options?: {
      width?: number | null;
      height?: number | null;
      fit?: 'cover' | 'contain' | 'fill' | 'inside' | 'outside';
    },
  ): Promise<{ url: string; mime: string }> {
    const exist = await this.minioService.client.bucketExists(bucketName);

    if (!exist) await this.minioService.client.makeBucket(bucketName);

    const sharpInstance = sharp(image.buffer);
    const processedImage = await sharpInstance
      .resize(options.width, options.height, { fit: options.fit || 'cover' })
      .toBuffer();
    const processedName = `${id}/${fileName}.${image.mimetype.split('/')[1]}`;

    await this.minioService.client.putObject(bucketName, processedName, processedImage);

    return { url: processedName, mime: image.mimetype };
  }

  async deleteImage(bucketName: string, fileName: string): Promise<void> {
    await this.minioService.client.removeObject(bucketName, fileName);
  }
}
