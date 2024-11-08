import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { DeviceDto } from '../../common/dto/device.dto.js';

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}

  async saveSession(userId: number, token: string, device: DeviceDto) {
    const session = await this.prisma.token.findFirst({
      where: { userId, ip: device.ip, userAgent: device.userAgent },
    });

    if (session) return;

    await this.prisma.token.create({
      data: { userId, token, ...device },
    });
  }

  async removeSession(userId: number, device: DeviceDto) {
    const session = await this.prisma.token.findFirst({
      where: { userId: userId, ip: device.ip, userAgent: device.userAgent },
    });

    if (!session) throw new BadRequestException('Сесію не знайдено!');

    await this.prisma.token.delete({ where: { id: session.id } });
  }

  async removeAllSessions(userId: number) {
    await this.prisma.token.deleteMany({ where: { userId } });
  }
}
