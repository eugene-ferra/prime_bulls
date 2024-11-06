import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { User } from '../types/user.type.js';
import { UpdateUserInfoDto } from '../dto/updateUserInfo.dto.js';
import { CreateUserDto } from '../dto/createUser.dto.js';

@Injectable()
export class UserHelperService {
  constructor(private readonly prisma: PrismaService) {}

  private _include = {
    reviews: true,
    comments: true,
    commentLikes: true,
    reviewLikes: true,
    postLikes: true,
    addresses: true,
    savedProducts: true,
  };

  async isExists(id: number): Promise<boolean> {
    return !!(await this.prisma.user.findUnique({ where: { id } }));
  }

  async isEmailExists(email: string): Promise<boolean> {
    return !!(await this.prisma.user.findUnique({ where: { email } }));
  }

  async findById(number): Promise<User> {
    return await this.prisma.user.findUnique({ where: { id: number }, include: this._include });
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({ where: { email }, include: this._include });
  }

  async update(id: number, data: UpdateUserInfoDto): Promise<User> {
    return await this.prisma.user.update({ where: { id }, data, include: this._include });
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async create(payload: CreateUserDto, password: string): Promise<User> {
    return await this.prisma.user.create({
      data: { ...payload, password, role: 'USER' },
      include: this._include,
    });
  }
}
