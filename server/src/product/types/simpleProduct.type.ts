import { Prisma } from '@prisma/client';

export type SimpleProduct = Prisma.ProductGetPayload<{
  include: {
    category: true;
  };
}> & { reviewCount: number; avgReview: number };
