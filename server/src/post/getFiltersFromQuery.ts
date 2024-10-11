import { Prisma } from '@prisma/client';
import { FilterPostsDto } from './dto/filterPosts.dto.js';

// ! TEMPORARY. implement univarsal reusefull solution for filtering and sorting
export const getFiltersFromQuery = (payload: FilterPostsDto) => {
  let where: Prisma.PostWhereInput = {};
  let page: number = 1,
    limit: number = 12;

  if (payload.title) where.title = { contains: payload.title, mode: 'insensitive' };
  if (payload.slug) where.slug = { contains: payload.slug, mode: 'insensitive' };
  if (payload.isActive) where.isActive = payload.isActive === true;

  if (payload.page) page = payload.page;
  if (payload.limit) limit = payload.limit;

  return { where, page, limit };
};
