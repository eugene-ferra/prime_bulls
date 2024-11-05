import { Prisma } from '@prisma/client';

export type CartProduct = Prisma.ProductGetPayload<{
  include: { productVariants: { include: { variant: true } } };
}>;
