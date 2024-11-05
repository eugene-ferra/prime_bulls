import { Prisma } from '@prisma/client';

export type CartProductVariant = Prisma.ProductVariantGetPayload<{ include: { variant: true } }>;
