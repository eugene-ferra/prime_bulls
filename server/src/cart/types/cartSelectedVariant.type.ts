import { Prisma } from '@prisma/client';

export type CartSelectedVariant = Prisma.CartItemVariantGetPayload<{
  include: {
    variantValue: true;
    variantName: true;
  };
}>;
