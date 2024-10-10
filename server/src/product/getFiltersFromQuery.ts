import { Prisma } from '@prisma/client';
import { FilterProductsDto } from './dto/filterProducts.dto.js';

// ! TEMPORARY. implement univarsal reusefull solution for filtering and sorting
export const getFiltersFromQuery = (payload: FilterProductsDto) => {
  let where: Prisma.ProductWhereInput = {};
  let page: number = 1,
    limit: number = 12;

  if (payload.title) where.title = { contains: payload.title, mode: 'insensitive' };
  if (payload.subtitle) where.title = { contains: payload.subtitle, mode: 'insensitive' };
  if (payload.slug) where.slug = { contains: payload.slug, mode: 'insensitive' };
  if (payload.categoryId) where.categoryId = payload.categoryId;
  if (payload.basePrice && payload.basePrice.length === 2)
    where.basePrice = { gte: payload.basePrice[0] || 0, lte: payload.basePrice[1] || null };
  if (payload.salePercent && payload.salePercent.length === 2)
    where.salePercent = { gte: payload.salePercent[0] || 0, lte: payload.salePercent[1] || null };
  if (payload.isActive) where.isActive = payload.isActive === true;

  if (payload.page) page = payload.page;
  if (payload.limit) limit = payload.limit;

  return { where, page, limit };
};
