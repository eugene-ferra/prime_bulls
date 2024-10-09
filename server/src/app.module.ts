import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaService } from './prisma-service/prisma-service.service.js';
import { AdminModuleModule } from './admin-module/admin-module.module.js';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({ envFilePath: '../.env', isGlobal: true }), AdminModuleModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
