import { BadRequestException, Injectable } from '@nestjs/common';
import { CartItemDto } from './dto/cartItem.dto.js';
import { UpdateCartItemDto } from './dto/updateCartItem.dto.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { UserService } from '../user/services/user.service.js';
import { ProductService } from '../product/services/product.service.js';
import { VariantDto } from './dto/variantDto.js';
import { Cart } from './types/cart.type.js';
import { CartItem } from './types/cartItem.type.js';

@Injectable()
export class CartService {
  constructor(
    private prisma: PrismaService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async addItem(userId: number, createCartDto: CartItemDto): Promise<Cart> {
    const { productId, quantity, variants } = createCartDto;

    const user = await this.userService.findOne(userId);
    if (!user) throw new BadRequestException('Користувача не знайдено!');

    const product = await this.productService.isExists(productId);
    if (!product) throw new BadRequestException('Товар не знайдено!');

    if (!(await this.isVariantsValid(variants, productId)))
      throw new BadRequestException('Неправильні опції товару!');

    const cartItemExists = await this.prisma.cartItem.findUnique({
      where: { productId_userId: { productId, userId } },
    });

    if (cartItemExists) throw new BadRequestException('Товар вже додано до кошика!');

    const cartItem = await this.prisma.cartItem.create({
      data: { userId, productId, quantity },
    });

    if (variants && variants.length) {
      await this.prisma.cartItemVariant.createMany({
        data: variants.map(({ variantNameId, variantValueId }) => ({
          cartItemId: cartItem.id,
          variantNameId,
          variantValueId,
        })),
      });
    }

    return await this.find(userId);
  }

  async find(userId: number): Promise<Cart> {
    const cartItems = await this.prisma.cartItem.findMany({
      where: { userId },
      include: {
        product: { include: { productVariants: { include: { variant: true } } } },
        cartItemVariants: { include: { variantValue: true, variantName: true } },
      },
    });

    const cartItemsWithPrices: CartItem[] = cartItems.map((item) => {
      let itemPrice = item.product.basePrice;
      let itemSalePercent = item.product.salePercent || 0;

      if (item.cartItemVariants.length) {
        item.cartItemVariants.forEach((variant) => {
          switch (variant.variantValue.effectType) {
            case 'MULTIPLIER':
              itemPrice *= variant.variantValue.amount;
              break;

            case 'FIXED':
              itemPrice += variant.variantValue.amount;
              break;

            case 'PERCENT':
              itemPrice += variant.variantValue.amount * itemPrice;
              break;

            default:
              break;
          }
        });
      }

      const newPrice = itemSalePercent ? itemPrice - (itemPrice * itemSalePercent) / 100 : itemPrice;

      return {
        ...item,
        actualPrice: newPrice,
        oldPrice: itemPrice,
      };
    });

    return {
      items: cartItemsWithPrices,
      actualSum: cartItemsWithPrices.reduce((acc, item) => acc + item.actualPrice * item.quantity, 0),
      oldSum: cartItemsWithPrices.reduce((acc, item) => acc + item.oldPrice * item.quantity, 0),
    };
  }

  async updateItem(userId: number, productId: number, updateCartDto: UpdateCartItemDto): Promise<Cart> {
    const { variants, quantity } = updateCartDto;

    const currentCart = await this.prisma.cartItem.findUnique({
      where: { productId_userId: { productId, userId } },
    });

    if (!currentCart) throw new BadRequestException('Кошик не знайдено!');

    if (!(await this.isVariantsValid(variants, productId)))
      throw new BadRequestException('Неправильні опції товару!');

    await this.prisma.cartItemVariant.deleteMany({ where: { cartItemId: currentCart.id } });

    if (variants && variants.length) {
      await this.prisma.cartItemVariant.createMany({
        data: variants.map(({ variantNameId, variantValueId }) => ({
          cartItemId: currentCart.id,
          variantNameId,
          variantValueId,
        })),
      });
    }

    await this.prisma.cartItem.update({ where: { id: currentCart.id }, data: { quantity } });

    return await this.find(userId);
  }

  async removeItem(userId: number, productId: number): Promise<Cart> {
    await this.prisma.cartItem.delete({ where: { productId_userId: { userId, productId } } });

    return await this.find(userId);
  }

  async clearCart(userId: number): Promise<Cart> {
    await this.prisma.cartItem.deleteMany({ where: { userId } });

    return await this.find(userId);
  }

  private async isVariantsValid(variants: VariantDto[], productId: number): Promise<boolean> {
    if (!variants || !variants.length) return true;

    const uniqueVariantsNames = new Set(variants.map((variant) => variant.variantNameId));
    if (uniqueVariantsNames.size !== variants.length) return false;

    for (const variant of variants) {
      const variantName = await this.prisma.variant.findUnique({ where: { id: variant.variantNameId } });
      if (!variantName) return false;

      const variantValue = await this.prisma.productVariant.findUnique({
        where: { id: variant.variantValueId, productId, variantId: variant.variantNameId },
      });
      if (!variantValue) return false;
    }

    return true;
  }
}
