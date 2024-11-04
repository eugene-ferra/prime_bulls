import { Prisma } from '@prisma/client';
import { Reply } from './reply.type.js';

export type Review = Prisma.ReviewGetPayload<{
  include: {
    images: true;
    user: true;
    likes: true;
  };
}> & { replyCount: number; reviews: Reply[] };
