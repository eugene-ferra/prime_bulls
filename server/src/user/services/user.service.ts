import { ConflictException, Injectable } from '@nestjs/common';
import { CreateUserDto } from '../dto/createUser.dto.js';
import { UpdateUserInfoDto } from '../dto/updateUserInfo.dto.js';
import { UpdateUserPasswordDto } from '../dto/updateUserPassword.dto.js';
import { User } from '../types/user.type.js';
import { AvatarService } from './avatar.service.js';
import { PasswordService } from './password.service.js';
import { UpdateUserAddressDto } from '../dto/updateUserAddress.dto.js';
import { AddressService } from './address.service.js';
import { UserHelperService } from './userHelper.service.js';
import { UserAddressDto } from '../dto/userAddress.dto.js';
import { FavouriteService } from './favourite.service.js';

@Injectable()
export class UserService {
  constructor(
    private avatarService: AvatarService,
    private passwordService: PasswordService,
    private addressService: AddressService,
    private favoriteService: FavouriteService,
    private userHelper: UserHelperService,
  ) {}

  async isExists(id: number): Promise<boolean> {
    return await this.userHelper.isExists(id);
  }

  async isEmailExists(email: string): Promise<boolean> {
    return await this.userHelper.isEmailExists(email);
  }

  async isPasswordCorrect(email: string, password: string): Promise<boolean> {
    return await this.passwordService.isCorrectPassword(email, password);
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    if (await this.userHelper.isEmailExists(createUserDto.email))
      throw new ConflictException('Користувач з такою поштою вже існує!');

    const hashedPassword = await this.passwordService.hashPassword(createUserDto.password);

    return await this.userHelper.create(createUserDto, hashedPassword);
  }

  async findByEmail(email: string): Promise<User> {
    return await this.userHelper.findByEmail(email);
  }

  async findOne(id: number): Promise<User> {
    return await this.userHelper.findById(id);
  }

  async updateInfo(id: number, info: UpdateUserInfoDto): Promise<User> {
    return await this.userHelper.update(id, info);
  }

  async addAddress(userId: number, address: UserAddressDto): Promise<User> {
    await this.addressService.addAddress(userId, address);
    return await this.userHelper.findById(userId);
  }

  async updateAddress(userId: number, addressId: number, address: UpdateUserAddressDto): Promise<User> {
    await this.addressService.updateAddress(userId, addressId, address);
    return await this.userHelper.findById(userId);
  }

  async deleteAddress(userId: number, addressId: number): Promise<User> {
    await this.addressService.deleteAddress(userId, addressId);
    return await this.userHelper.findById(userId);
  }

  async updateAvatar(userId: number, file: Express.Multer.File): Promise<User> {
    await this.avatarService.updateAvatar(userId, file);
    return await this.userHelper.findById(userId);
  }

  async deleteAvatar(userId: number): Promise<User> {
    await this.avatarService.deleteAvatar(userId);
    return await this.userHelper.findById(userId);
  }

  async delete(id: number): Promise<void> {
    await this.avatarService.deleteAvatar(id);
    await this.userHelper.delete(id);
  }

  async addFavorite(userId: number, productId: number): Promise<User> {
    await this.favoriteService.addFavorite(userId, productId);
    return await this.userHelper.findById(userId);
  }

  async removeFavorite(userId: number, productId: number): Promise<User> {
    await this.favoriteService.removeFavorite(userId, productId);
    return await this.userHelper.findById(userId);
  }

  async updatePassword(userId: number, info: UpdateUserPasswordDto): Promise<User> {
    await this.passwordService.update(userId, info);
    return await this.userHelper.findById(userId);
  }

  async getResetToken(email: string): Promise<{ token: string; expiredAt: Date }> {
    return await this.passwordService.createResetToken(email);
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<void> {
    await this.passwordService.resetPassword(email, token, newPassword);
  }
}
