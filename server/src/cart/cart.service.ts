import { BadRequestException, Injectable } from '@nestjs/common';
import { CartItemDto } from './dto/cartItem.dto.js';
import { UpdateCartItemDto } from './dto/updateCartItem.dto.js';
import { UserService } from '../user/services/user.service.js';
import { ProductService } from '../product/services/product.service.js';
import { Cart } from './types/cart.type.js';
import { CartItem } from './types/cartItem.type.js';
import { CartRepositoryService } from './services/cartRepository.service.js';

@Injectable()
export class CartService {
  constructor(
    private cartRepository: CartRepositoryService,
    private userService: UserService,
    private productService: ProductService,
  ) {}

  async addItem(userId: number, createCartDto: CartItemDto): Promise<Cart> {
    const { productId, quantity, variants } = createCartDto;

    const errors = await Promise.all([
      !this.userService.isExists(userId),
      !this.productService.isExists(productId),
      !this.cartRepository.isVariantsValid(variants, productId),
      this.cartRepository.isCartExist(userId, productId),
    ]);

    if (errors.some((error) => error)) throw new BadRequestException('Помилка додавання товару!');

    const cartItemId = await this.cartRepository.saveItem(userId, productId, quantity);
    await this.cartRepository.saveVariants(cartItemId, variants);

    return await this.find(userId);
  }

  async find(userId: number): Promise<Cart> {
    const cartItems = await this.cartRepository.getCart(userId);

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

    const cartId = await this.cartRepository.getCartItemId(userId, productId);
    if (!cartId) throw new BadRequestException('Кошик не знайдено!');

    if (!(await this.cartRepository.isVariantsValid(variants, productId)))
      throw new BadRequestException('Неправильні опції товару!');

    await this.cartRepository.deleteVariants(cartId);
    await this.cartRepository.saveVariants(cartId, variants);
    await this.cartRepository.updateItemQuantity(cartId, quantity);

    return await this.find(userId);
  }

  async removeItem(userId: number, productId: number): Promise<Cart> {
    await this.cartRepository.getCartItemId(userId, productId);

    return await this.find(userId);
  }

  async clearCart(userId: number): Promise<Cart> {
    await this.cartRepository.deleteAll(userId);

    return await this.find(userId);
  }
}
