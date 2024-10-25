import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaService } from '../prisma-service/prisma-service.service.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import { ConfigModule } from '@nestjs/config';
import { MailService } from '../mail/mail.service.js';

@Module({
  imports: [ConfigModule, UserModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [PrismaService, MailService, AuthService],
})
export class AuthModule {}
