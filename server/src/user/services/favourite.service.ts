import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { ProductService } from '../../product/services/product.service.js';
import { UserHelperService } from './userHelper.service.js';

@Injectable()
export class FavouriteService {
  constructor(
    private prisma: PrismaService,
    private productService: ProductService,
    private userHelper: UserHelperService,
  ) {}

  async addFavorite(userId: number, productId: number): Promise<void> {
    if (!this.userHelper.isExists(userId)) throw new BadRequestException('Користувача не знайдено!');
    if (!(await this.productService.isExists(productId))) throw new BadRequestException('Товар не знайдено!');

    if (!(await this.isAdded(userId, productId)))
      await this.prisma.savedProduct.create({ data: { userId, productId } });
  }

  async removeFavorite(userId: number, productId: number): Promise<void> {
    await this.prisma.savedProduct.delete({ where: { userId_productId: { userId, productId } } });
  }

  private async isAdded(userId: number, productId: number): Promise<boolean> {
    return !!(await this.prisma.savedProduct.findUnique({
      where: { userId_productId: { userId, productId } },
    }));
  }
}
