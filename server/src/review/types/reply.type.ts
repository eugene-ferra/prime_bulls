import { Prisma } from '@prisma/client';

export type Reply = Prisma.ReviewGetPayload<{
  include: {
    images: true;
    user: true;
    likes: true;
  };
}> & { replyCount: number };
