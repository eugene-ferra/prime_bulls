import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { VariantDto } from '../dto/variantDto.js';

@Injectable()
export class CartRepositoryService {
  constructor(private readonly prisma: PrismaService) {}

  async saveItem(userId: number, productId: number, quantity: number): Promise<number> {
    const saved = await this.prisma.cartItem.create({
      data: { userId, productId, quantity },
    });

    return saved.id;
  }

  async deleteItem(userId: number, productId): Promise<void> {
    await this.prisma.cartItem.delete({ where: { productId_userId: { userId, productId } } });
  }

  async deleteAll(userId: number): Promise<void> {
    await this.prisma.cartItem.deleteMany({ where: { userId } });
  }

  async saveVariants(cartItemId: number, variants: { nameId: number; valueId: number }[]): Promise<void> {
    if (!variants || !variants.length) return;

    await this.prisma.cartItemVariant.createMany({
      data: variants.map(({ nameId, valueId }) => ({
        cartItemId,
        variantNameId: nameId,
        variantValueId: valueId,
      })),
    });
  }

  async deleteVariants(cartItemId: number): Promise<void> {
    await this.prisma.cartItemVariant.deleteMany({ where: { cartItemId } });
  }

  async updateItemQuantity(cartId: number, quantity: number): Promise<void> {
    await this.prisma.cartItem.update({ where: { id: cartId }, data: { quantity } });
  }

  async getCart(userId: number) {
    return await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: { include: { productVariants: { include: { variant: true } } } },
        cartItemVariants: { include: { variantValue: true, variantName: true } },
      },
    });
  }

  async getCartItemId(userId: number, productId): Promise<number> {
    const doc = await this.prisma.cartItem.findUnique({
      where: { productId_userId: { productId, userId } },
    });

    return doc.id;
  }

  async isCartExist(userId: number, productId: number): Promise<boolean> {
    return !!(await this.prisma.cartItem.findUnique({
      where: { productId_userId: { productId, userId } },
    }));
  }

  async isVariantsValid(variants: VariantDto[], productId: number): Promise<boolean> {
    if (!variants || !variants.length) return true;

    const uniqueVariantsNames = new Set(variants.map((variant) => variant.nameId));
    if (uniqueVariantsNames.size !== variants.length) return false;

    for (const variant of variants) {
      const variantName = await this.prisma.variant.findUnique({ where: { id: variant.nameId } });
      if (!variantName) return false;

      const variantValue = await this.prisma.productVariant.findUnique({
        where: { id: variant.valueId, productId, variantId: variant.nameId },
      });
      if (!variantValue) return false;
    }

    return true;
  }
}
