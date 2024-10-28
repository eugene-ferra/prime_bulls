import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class TopicService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(isActive = true) {
    return await this.prisma.topic.findMany({ where: { isActive } });
  }
}
