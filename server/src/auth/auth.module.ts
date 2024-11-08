import { Module } from '@nestjs/common';
import { AuthService } from './auth.service.js';
import { AuthController } from './auth.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserModule } from '../user/user.module.js';
import { JwtModule } from '@nestjs/jwt';
import { MailModule } from '../mail/mail.module.js';
import { SessionRepository } from './services/session.service.js';
import { TokenService } from './services/token.service.js';

@Module({
  imports: [UserModule, MailModule, JwtModule.register({ global: true })],
  controllers: [AuthController],
  providers: [PrismaService, SessionRepository, TokenService, AuthService],
})
export class AuthModule {}
