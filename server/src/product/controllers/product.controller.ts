import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { ProductService } from '../services/product.service.js';
import { FilterProductsDto } from '../dto/filterProducts.dto.js';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { ExpandedProductEntity } from '../entities/expandedProductEntity.js';
import { SimpleProductEntity } from '../entities/simpleProduct.entity.js';
import { Pagination } from '../../common/types/IPagination.type.js';
import { ApiPaginatedResponse } from '../../common/decorators/apiPaginatedResponse.decorator.js';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';

@ApiTags('products')
@ApiNotFoundResponse()
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBadRequestResponse()
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

  @ApiSingleResponse(ExpandedProductEntity)
  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<ExpandedProductEntity> {
    const product = await this.productService.findOne(slug);

    if (!product) throw new NotFoundException('Товар не знайдено!');

    return new ExpandedProductEntity(product);
  }
}
