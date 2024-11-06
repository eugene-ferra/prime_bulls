import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { UserAddressDto } from '../dto/userAddress.dto.js';
import { UpdateUserAddressDto } from '../dto/updateUserAddress.dto.js';
import { UserHelperService } from './userHelper.service.js';

@Injectable()
export class AddressService {
  constructor(
    private prisma: PrismaService,
    private userHelper: UserHelperService,
  ) {}

  async addAddress(userId: number, address: UserAddressDto): Promise<void> {
    if (!(await this.userHelper.isExists(userId))) throw new BadRequestException('Користувача не знайдено!');

    await this.prisma.address.create({ data: { ...address, userId } });
  }

  async updateAddress(userId: number, addressId: number, address: UpdateUserAddressDto): Promise<void> {
    await this.prisma.address.update({ where: { userId, id: addressId }, data: address });
  }

  async deleteAddress(userId: number, addressId: number): Promise<void> {
    await this.prisma.address.delete({ where: { userId: userId, id: addressId } });
  }
}
