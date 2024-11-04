import { Prisma } from '@prisma/client';

export type Post = Prisma.PostGetPayload<{
  include: {
    topics: {
      include: {
        topic: true;
      };
    };
    views: true;
    likes: true;
  };
}>;
