import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { Category } from './types/category.type.js';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}

  async findAll(isActive = true): Promise<Category[]> {
    return await this.prisma.category.findMany({ where: { isActive } });
  }
}
