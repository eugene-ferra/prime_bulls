import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailService {
  constructor(
    private mailerService: MailerService,
    private configService: ConfigService,
  ) {}

  async sendUserConfirmation(name: string, email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Аккаунт успішно створено!',
      template: './welcome',
      context: {
        name: name,
      },
    });
  }

  async sendForgotPassword(email: string, token: string, time: Date) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Зміна паролю',
      template: './resetPassword',
      context: {
        link: `${this.configService.getOrThrow('CLIENT_URL')}/reset-password?token=${token}&email=${email}`,
        time: time.getMinutes(),
      },
    });
  }
}
