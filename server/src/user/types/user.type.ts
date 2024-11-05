import { Prisma } from '@prisma/client';

export type User = Prisma.UserGetPayload<{
  include: {
    reviews: true;
    comments: true;
    commentLikes: true;
    reviewLikes: true;
    postLikes: true;
    addresses: true;
    savedProducts: true;
  };
}>;
