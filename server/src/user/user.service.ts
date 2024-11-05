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
import crypto from 'crypto';
import { ConfigService } from '@nestjs/config';
import { User } from './types/user.type.js';

@Injectable()
export class UserService {
  constructor(
    private prisma: PrismaService,
    private minioService: ImageService,
    private productService: ProductService,
    private configService: ConfigService,
  ) {}

  private folder = 'users';

  async create(createUserDto: CreateUserDto): Promise<User> {
    const isExist = await this.findByEmail(createUserDto.email);
    if (isExist) throw new ConflictException('Користувач з такою поштою вже існує!');

    const hashedPassword = await this.hashPassword(createUserDto.password);

    const doc = await this.prisma.user.create({
      data: { ...createUserDto, password: hashedPassword, role: 'USER' },
    });

    return await this.findById(doc.id);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { email },
      include: {
        reviews: true,
        comments: true,
        commentLikes: true,
        reviewLikes: true,
        postLikes: true,
        addresses: true,
        savedProducts: true,
      },
    });
  }

  async findByPhone(phone: string): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { phone },
      include: {
        reviews: true,
        comments: true,
        commentLikes: true,
        reviewLikes: true,
        postLikes: true,
        addresses: true,
        savedProducts: true,
      },
    });
  }

  async findById(id: number): Promise<User> {
    return await this.prisma.user.findUnique({
      where: { id },
      include: {
        reviews: true,
        comments: true,
        commentLikes: true,
        reviewLikes: true,
        postLikes: true,
        addresses: true,
        savedProducts: true,
      },
    });
  }

  async updateInfo(id: number, info: UpdateUserInfoDto): Promise<User> {
    const doc = await this.prisma.user.update({ where: { id }, data: info });

    if (!doc) throw new NotFoundException('Користувача не знайдено!');

    return await this.findById(doc.id);
  }

  async updatePassword(id: number, info: UpdateUserPasswordDto): Promise<User> {
    const { newPassword, oldPassword, newPasswordConfirm } = info;
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('Користувача не знайдено!');
    if (newPassword !== newPasswordConfirm) throw new BadRequestException('Паролі не співпадають!');
    if (!(await this.isCorrectPassword(oldPassword, user.password)))
      throw new BadRequestException('Старий пароль вказано невірно!');

    const newHashedPassword = await this.hashPassword(newPassword);
    const doc = await this.prisma.user.update({ where: { id }, data: { password: newHashedPassword } });

    return await this.findById(doc.id);
  }

  async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt();

    return await bcrypt.hash(password, salt);
  }

  async isCorrectPassword(testPassword: string, hashedPassword: string): Promise<boolean> {
    return await bcrypt.compare(testPassword, hashedPassword);
  }

  async delete(id: number): Promise<void> {
    await this.prisma.user.delete({ where: { id } });
  }

  async updateAvatar(id: number, file: Express.Multer.File): Promise<User> {
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

    const doc = await this.prisma.user.update({
      where: { id },
      data: { imageUrl: savedImage.url, mimeType: savedImage.mime, altText: savedImageName },
    });

    return await this.findById(doc.id);
  }

  async deleteAvatar(id: number): Promise<User> {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('Користувача не знайдено!');

    if (user.imageUrl) {
      await this.minioService.deleteImage(this.folder, user.imageUrl);
    }

    const doc = await this.prisma.user.update({
      where: { id },
      data: { imageUrl: null, mimeType: null, altText: null },
    });

    return await this.findById(doc.id);
  }

  async addAddress(id: number, address: UserAddressDto): Promise<User> {
    const user = await this.findById(id);

    if (!user) throw new NotFoundException('Користувача не знайдено!');

    await this.prisma.address.create({ data: { ...address, userId: id } });

    return await this.findById(id);
  }

  async updateAddress(userId: number, addressId: number, address: UpdateUserAddressDto): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Користувача не знайдено!');

    await this.prisma.address.update({ where: { userId, id: addressId }, data: address });
    return await this.findById(userId);
  }

  async deleteAddress(userId: number, addressId: number): Promise<User> {
    const user = await this.findById(userId);
    if (!user) throw new NotFoundException('Користувача не знайдено!');

    await this.prisma.address.delete({ where: { userId, id: addressId } });
    return await this.findById(userId);
  }

  async addFavorite(userId: number, productId: number): Promise<User> {
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

  async generateResetToken(email: string) {
    const user = await this.findByEmail(email);
    if (!user) throw new NotFoundException('Користувача не знайдено!');

    const plainResetToken = crypto.randomBytes(32).toString('hex');
    const hashedResetToken = crypto.createHash('sha256').update(plainResetToken).digest('hex');
    const tokenLifeTime = this.configService.getOrThrow<number>('RESET_PASSWORD_TOKEN_LIFETIME');
    const expiredAt = new Date(Date.now() + +tokenLifeTime);

    await this.prisma.user.update({
      where: { email },
      data: {
        passwordResetToken: hashedResetToken,
        passwordResetTokenExpiredAt: expiredAt,
      },
    });

    return {
      token: plainResetToken,
      expiredAt: expiredAt,
    };
  }

  async resetPassword(email: string, token: string, newPassword: string) {
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new NotFoundException('Користувача не знайдено!');

    if (user.passwordResetToken !== hashedToken || user.passwordResetTokenExpiredAt < new Date())
      throw new BadRequestException('Невірний токен або термін дії токена закінчився!');

    const newHashedPassword = await this.hashPassword(newPassword);
    await this.prisma.user.update({
      where: { email },
      data: { password: newHashedPassword, passwordResetToken: null, passwordResetTokenExpiredAt: null },
    });

    return await this.findByEmail(email);
  }
}
