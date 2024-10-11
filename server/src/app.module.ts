import { Module } from '@nestjs/common';
import { PrismaService } from './prisma-service/prisma-service.service.js';
import { AdminModuleModule } from './admin-module/admin-module.module.js';
import { ConfigModule } from '@nestjs/config';
import { ProductModule } from './product/product.module.js';
import { PostModule } from './post/post.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }),
    AdminModuleModule,
    ProductModule,
    PostModule,
  ],
  controllers: [],
  providers: [PrismaService],
})
export class AppModule {}
