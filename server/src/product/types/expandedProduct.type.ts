import { Prisma } from '@prisma/client';

export type ExpandedProduct = Prisma.ProductGetPayload<{
  include: {
    category: true;
    images: true;
    attributes: {
      include: { attribute: true };
    };
    productVariants: {
      include: { variant: true };
    };
  };
}> & { reviewCount: number; avgReview: number };
