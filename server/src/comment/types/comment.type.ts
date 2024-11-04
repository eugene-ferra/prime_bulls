import { Prisma } from '@prisma/client';
import { Reply } from './reply.type.js';

export type Comment = Prisma.CommentGetPayload<{
  include: {
    user: true;
    likes: true;
  };
}> & { replyCount: number; comments: Reply[] };
