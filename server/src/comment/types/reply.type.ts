import { Prisma } from '@prisma/client';

export type Reply = Prisma.CommentGetPayload<{
  include: {
    user: true;
    likes: true;
  };
}> & { replyCount: number };
