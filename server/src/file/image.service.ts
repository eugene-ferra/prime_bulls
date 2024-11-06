import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import sharp from 'sharp';
import { Image } from 'src/common/dto/image.dto.js';
import CreateImageDto from './dto/createImage.dto.js';

@Injectable()
export class ImageService {
  constructor(private readonly minioService: MinioService) {}

  async saveImage(image: Express.Multer.File, payload: CreateImageDto): Promise<Image> {
    const { bucketName, id, options } = payload;

    const exist = await this.minioService.client.bucketExists(bucketName);

    if (!exist) await this.minioService.client.makeBucket(bucketName);

    const sharpInstance = sharp(image.buffer);
    const processedImage = await sharpInstance
      .resize(options.width, options.height, { fit: options.fit || 'cover' })
      .toBuffer();
    const processedName = `${id}/${image.originalname}.${image.mimetype.split('/')[1]}`;

    await this.minioService.client.putObject(bucketName, processedName, processedImage);

    return { url: processedName, mime: image.mimetype };
  }

  async deleteImage(bucketName: string, fileName: string): Promise<void> {
    await this.minioService.client.removeObject(bucketName, fileName);
  }

  async saveImages(images: Express.Multer.File[], payload: CreateImageDto): Promise<Image[]> {
    return await Promise.all(images.map(async (image) => await this.saveImage(image, payload)));
  }

  async deleteImages(bucketName: string, fileNames: string[]): Promise<void> {
    await this.minioService.client.removeObjects(bucketName, fileNames);
  }
}
