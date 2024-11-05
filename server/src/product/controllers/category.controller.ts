import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiPaginatedResponse } from '../../common/decorators/apiPaginatedResponse.decorator.js';
import { CategoryEntity } from '../entities/category.entity.js';
import { Pagination } from '../../common/types/IPagination.type.js';
import { CategoryService } from '../services/category.service.js';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('categories')
@ApiPaginatedResponse(CategoryEntity)
@ApiNotFoundResponse()
@Controller('/categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Get('/')
  async getCategories(): Promise<Pagination<CategoryEntity>> {
    const docs = await this.categoryService.findAll();

    if (!docs) throw new NotFoundException('Категорій не знайдено!');

    return {
      docs: docs.map((item) => new CategoryEntity(item)),
      totalDocs: docs.length,
      currentPage: 1,
      totalPages: 1,
    };
  }
}
