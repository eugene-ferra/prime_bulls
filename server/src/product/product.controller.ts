import { Controller, Get, NotFoundException, Param, Query, ValidationPipe } from '@nestjs/common';
import { ProductService } from './product.service.js';
import { FilterProductsDto } from './dto/filterProducts.dto.js';
import { Prisma } from '@prisma/client';
import { getFiltersFromQuery } from './getFiltersFromQuery.js';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Get('/')
  async findAll(@Query() query: FilterProductsDto) {
    const { where, page, limit } = getFiltersFromQuery(query);
    const products = await this.productService.findAll({ where, page, limit });

    if (!products.data.length) throw new NotFoundException();

    return products;
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.productService.findBySlug(slug);

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }
}
