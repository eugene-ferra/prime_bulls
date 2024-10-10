import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma-service/prisma-service.service.js';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  async findAll(payload: { where: Prisma.ProductWhereInput; page?: number; limit?: number }) {
    const currentPage = payload.page || 1;
    const take = payload.limit || 12;
    const skip = currentPage * take - take;

    const data = await this.prisma.product.findMany({ where: payload.where, skip, take });
    const total = await this.prisma.product.count({ where: payload.where });

    return { data, currentPage, length: data.length, lastPage: Math.ceil(total / take) };
  }

  async findById(id: number) {
    return await this.prisma.product.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return await this.prisma.product.findFirst({ where: { slug } });
  }
}
