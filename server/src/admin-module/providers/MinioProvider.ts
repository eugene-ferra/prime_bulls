import { BaseProvider, ProviderOpts } from '@adminjs/upload';
import { ConfigService } from '@nestjs/config';
import { UploadedFile } from 'adminjs';
import { Client } from 'minio';

export class MinioProvider extends BaseProvider {
  private minioClient: Client;
  private config: ConfigService;

  constructor(bucket: string, opts?: ProviderOpts) {
    super(bucket, opts);

    this.config = new ConfigService();

    this.minioClient = new Client({
      endPoint: this.config.getOrThrow('MINIO_HOST'),
      port: parseInt(this.config.getOrThrow('MINIO_PORT')),
      accessKey: this.config.getOrThrow('MINIO_ACCESS_KEY'),
      secretKey: this.config.getOrThrow('MINIO_SECRET_KEY'),
      region: this.config.getOrThrow('MINIO_REGION'),
      useSSL: false,
    });
  }

  public async upload(file: UploadedFile, key: string): Promise<any> {
    try {
      const metaData = {
        'Content-Type': file.type,
        'Content-type': file.type,
      };
      const bucket = this.bucket;

      const exist = await this.minioClient.bucketExists(bucket);

      if (!exist) await this.minioClient.makeBucket(bucket, this.config.getOrThrow('MINIO_REGION') || '');

      await this.minioClient.fPutObject(bucket, key, file.path, metaData);

      return key;
    } catch (error) {
      throw error;
    }
  }

  public async delete(key: string, bucket: string): Promise<any> {
    try {
      return this.minioClient.removeObject(bucket, key);
    } catch (error) {
      throw error;
    }
  }

  public async path(key: string, bucket: string): Promise<string> {
    try {
      return await this.minioClient.presignedGetObject(bucket, key);
    } catch (error) {
      throw error;
    }
  }
}
