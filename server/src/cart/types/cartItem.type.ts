import { Prisma } from '@prisma/client';

export type CartItem = Prisma.CartItemGetPayload<{
  include: {
    product: { include: { productVariants: { include: { variant: true } } } };
    cartItemVariants: { include: { variantValue: true; variantName: true } };
  };
}> & { actualPrice: number; oldPrice: number };
