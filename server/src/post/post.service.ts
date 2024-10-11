import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma-service/prisma-service.service.js';

@Injectable()
export class PostService {
  constructor(private prisma: PrismaService) {}

  async findAll(payload: { where: Prisma.PostWhereInput; page?: number; limit?: number }) {
    const currentPage = payload.page || 1;
    const take = payload.limit || 12;
    const skip = currentPage * take - take;

    const data = await this.prisma.post.findMany({ where: payload.where, skip, take });
    const total = await this.prisma.post.count({ where: payload.where });

    return { data, currentPage, length: data.length, lastPage: Math.ceil(total / take) };
  }

  async findById(id: number) {
    return await this.prisma.post.findUnique({ where: { id } });
  }

  async findBySlug(slug: string) {
    return await this.prisma.post.findFirst({ where: { slug } });
  }
}
