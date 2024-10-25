import { Module } from '@nestjs/common';
import { PrismaService } from './prisma-service/prisma-service.service.js';
import { AdminModuleModule } from './admin-module/admin-module.module.js';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ProductModule } from './product/product.module.js';
import { PostModule } from './post/post.module.js';
import { UserModule } from './user/user.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MailModule } from './mail/mail.module.js';
import { MinioClientModule } from './minio/minio.module.js';
import { CommentModule } from './comment/comment.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }),
    AdminModuleModule,
    ProductModule,
    PostModule,
    UserModule,
    AuthModule,
    MailModule,
    MinioClientModule,
    CommentModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
