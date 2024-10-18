import { MailerService } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserConfirmation(name: string, email: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Аккаунт успішно створено!',
      template: './templates/welcome',
      context: {
        name: name,
      },
    });
  }
}
