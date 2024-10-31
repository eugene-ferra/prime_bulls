import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/createUser.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UpdateUserInfoDto } from './dto/updateUserInfo.dto.js';
import { UpdateUserPasswordDto } from './dto/updateUserPassword.dto.js';
import * as bcrypt from 'bcrypt';
import { ImageService } from '../file/image.service.js';
import slugify from 'slugify';
import { UserAddressDto } from './dto/userAddress.dto.js';
import { UpdateUserAddressDto } from './dto/updateUserAddress.dto.js';
import { ProductService } from '../product/product.service.js';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private minioService: ImageService,
    private productService: ProductService,
  ) {}

  private folder = 'users';

  async create(createUserDto: CreateUserDto) {
    const isExist = await this.findByEmail(createUserDto.email);
    if (isExist) throw new ConflictException('Користувач з такою поштою вже існує!');

    const hashedPassword = await this.hashPassword(createUserDto.password);

    return await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword, role: 'USER' },
    });
  }

  async findByEmail(email: string) {
    return await this.prisma.user.findUnique({ where: { email } });
  }

  async findByPhone(phone: string) {
    return await this.prisma.user.findUnique({ where: { phone } });
  }

  async findById(id: number) {
    return await this.prisma.user.findUnique({ where: { id } });
  }

  async updateInfo(id: number, info: UpdateUserInfoDto) {
    return await this.prisma.user.update({ where: { id }, data: info });
  }

  async updatePassword(id: number, info: UpdateUserPasswordDto) {
    const { newPassword, oldPassword, newPasswordConfirm } = info;
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('Користувача не знайдено!');
    if (newPassword !== newPasswordConfirm) throw new BadRequestException('Паролі не співпадають!');
    if (!(await this.isCorrectPassword(oldPassword, user.password)))
      throw new BadRequestException('Старий пароль вказано невірно!');

    const newHashedPassword = await this.hashPassword(newPassword);
    return await this.prisma.user.update({ where: { id }, data: { password: newHashedPassword } });
  }

  async hashPassword(password: string) {
    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(password, salt);
  }

  async isCorrectPassword(testPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(testPassword, hashedPassword);
  }

  async delete(id: number) {
    return await this.prisma.user.delete({ where: { id } });
  }

  async updateAvatar(id: number, file: Express.Multer.File) {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('Користувача не знайдено!');

    if (user.imageUrl) {
      await this.minioService.deleteImage(this.folder, user.imageUrl);
    }

    const savedImageName = slugify.default(`${user.id}-${user.name}-${Date.now()}`, { lower: true });
    const savedImage = await this.minioService.saveImage(file, this.folder, user.id, savedImageName, {
      width: 400,
      height: 400,
      fit: 'cover',
    });

    return await this.prisma.user.update({
      where: { id },
      data: { imageUrl: savedImage.url, mimeType: savedImage.mime, altText: savedImageName },
    });
  }

  async deleteAvatar(id: number) {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('Користувача не знайдено!');

    if (user.imageUrl) {
      await this.minioService.deleteImage(this.folder, user.imageUrl);
    }

    return await this.prisma.user.update({
      where: { id },
      data: { imageUrl: null, mimeType: null, altText: null },
    });
  }

  async addAddress(id: number, address: UserAddressDto) {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('Користувача не знайдено!');

    await this.prisma.address.create({ data: { ...address, userId: id } });

    return await this.findById(id);
  }

  async updateAddress(userId: number, addressId: number, address: UpdateUserAddressDto) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Користувача не знайдено!');

    await this.prisma.address.update({ where: { userId, id: addressId }, data: address });
    return await this.findById(userId);
  }

  async deleteAddress(userId: number, addressId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Користувача не знайдено!');

    await this.prisma.address.delete({ where: { userId, id: addressId } });
    return await this.findById(userId);
  }

  async addFavorite(userId: number, productId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Користувача не знайдено!');

    const product = await this.productService.findById(productId);
    if (!product) throw new NotFoundException('Товар не знайдено!');

    const isAdded = await this.prisma.savedProduct.findUnique({
      where: { userId_productId: { userId, productId } },
    });

    if (isAdded) throw new ConflictException('Товар вже додано до обраного!');

    await this.prisma.savedProduct.create({ data: { userId, productId } });
    return await this.findById(userId);
  }

  async removeFavorite(userId: number, productId: number) {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Користувача не знайдено!');

    const product = await this.productService.findById(productId);
    if (!product) throw new NotFoundException('Товар не знайдено!');

    await this.prisma.savedProduct.delete({ where: { userId_productId: { userId, productId } } });
    return await this.findById(userId);
  }
}
