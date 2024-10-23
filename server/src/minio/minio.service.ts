import { Injectable } from '@nestjs/common';
import { MinioService } from 'nestjs-minio-client';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MinioClientService {
  constructor(
    private readonly minioService: MinioService,
    private readonly config: ConfigService,
  ) {}

  async saveImage(image: Express.Multer.File, bucketName: string, fileName: string): Promise<string> {
    const exist = await this.minioService.client.bucketExists(bucketName);

    if (!exist) await this.minioService.client.makeBucket(bucketName);

    await this.minioService.client.putObject(bucketName, fileName, image.buffer);

    return fileName;
  }

  async deleteImage(bucketName: string, fileName: string): Promise<void> {
    await this.minioService.client.removeObject(bucketName, fileName);
  }
}
