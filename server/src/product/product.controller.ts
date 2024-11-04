import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { ProductService } from './product.service.js';
import { FilterProductsDto } from './dto/filterProducts.dto.js';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { ExpandedProductEntity } from './entities/expandedProductEntity.js';
import { SimpleProductEntity } from './entities/simpleProduct.entity.js';
import { CategoryService } from './category.service.js';
import { CategoryEntity } from './entities/category.entity.js';
import { Pagination } from '../common/types/IPagination.type.js';
import { ApiPaginatedResponse } from '../common/decorators/apiPaginatedResponse.decorator.js';

@ApiTags('products')
@ApiBadRequestResponse()
@ApiNotFoundResponse()
@UseInterceptors(ClassSerializerInterceptor)
@Controller('products')
export class ProductController {
  constructor(
    private readonly productService: ProductService,
    private readonly categoryService: CategoryService,
  ) {}

  @ApiPaginatedResponse(CategoryEntity)
  @Get('/categories')
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

  @ApiPaginatedResponse(SimpleProductEntity)
  @Get('/')
  async findAll(@Query() query: FilterProductsDto): Promise<Pagination<SimpleProductEntity>> {
    const data = await this.productService.findAll(query);

    if (!data.data.length) throw new NotFoundException('Товарів за вказаними параметрами не знайдено!');

    return {
      docs: data.data.map((item) => new SimpleProductEntity(item)),
      totalDocs: data.data.length,
      currentPage: query.page || 1,
      totalPages: data.lastPage,
    };
  }

  @ApiOkResponse({ type: ExpandedProductEntity })
  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<ExpandedProductEntity> {
    const product = await this.productService.findBySlug(slug);

    if (!product) throw new NotFoundException('Товар не знайдено!');

    return new ExpandedProductEntity(product);
  }
}
