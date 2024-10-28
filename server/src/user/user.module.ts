import { Module } from '@nestjs/common';
import { UserService } from './user.service.js';
import { UserController } from './user.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { FileModule } from '../file/file.module.js';

@Module({
  imports: [FileModule],
  controllers: [UserController],
  providers: [PrismaService, UserService],
  exports: [UserService],
})
export class UserModule {}
