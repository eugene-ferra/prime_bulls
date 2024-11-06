import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UpdateUserPasswordDto } from '../dto/updateUserPassword.dto.js';
import * as bcrypt from 'bcrypt';
import crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { User } from '../types/user.type.js';
import { UserHelperService } from './userHelper.service.js';

@Injectable()
export class PasswordService {
  constructor(
    private prisma: PrismaService,
    private configService: ConfigService,
    private userHelper: UserHelperService,
  ) {}

  async update(userId: number, info: UpdateUserPasswordDto): Promise<void> {
    const user = await this.userHelper.findById(userId);
    if (!user) throw new BadRequestException('Користувача не знайдено!');

    const { oldPassword, newPassword, newPasswordConfirm } = info;

    if (newPassword !== newPasswordConfirm) throw new BadRequestException('Паролі не співпадають!');
    if (!(await this.isCorrectPassword(oldPassword, user.password)))
      throw new BadRequestException('Старий пароль вказано невірно!');

    const newHashedPassword = await this.hashPassword(newPassword);
    await this.prisma.user.update({ where: { id: user.id }, data: { password: newHashedPassword } });
  }

  async createResetToken(email: string): Promise<{ token: string; expiredAt: Date }> {
    const plainResetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(plainResetToken).digest('hex');
    const tokenLifeTime = this.configService.getOrThrow<number>('RESET_PASSWORD_TOKEN_LIFETIME');
    const expiredAt = new Date(Date.now() + +tokenLifeTime);

    await this.prisma.user.update({
      where: { email },
      data: { passwordResetToken: hashedResetToken, passwordResetTokenExpiredAt: expiredAt },
    });

    return { token: plainResetToken, expiredAt: expiredAt };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const user = await this.userHelper.findByEmail(email);
    if (!user) throw new BadRequestException('Користувача не знайдено!');

    if (!this.isResetTokenValid(user, token))
      throw new BadRequestException('Невірний токен або термін дії токена закінчився!');

    const newHashedPassword = await this.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { email: user.email },
      data: { password: newHashedPassword, passwordResetToken: null, passwordResetTokenExpiredAt: null },
    });
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();
    return await bcrypt.hash(password, salt);
  }

  async isCorrectPassword(testPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(testPassword, hashedPassword);
  }

  async isResetTokenValid(user: User, token: string): Promise<boolean> {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    return user.passwordResetToken === hashedToken && user.passwordResetTokenExpiredAt > new Date();
  }
}
