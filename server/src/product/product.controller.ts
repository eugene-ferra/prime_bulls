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
import { SimpleProductEntity } from './entities/simpleProductEntity.js';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({
    description: 'Retrieves all products based on query string with filters, sorting and pagination',
    type: [SimpleProductEntity],
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  async findAll(@Query() query: FilterProductsDto) {
    const data = await this.productService.findAll(query);

    if (!data.data.length) throw new NotFoundException('Товарів за вказаними параметрами не знайдено!');

    return {
      docs: data.data.map((item) => {
        return new SimpleProductEntity(item);
      }),
      lastPage: data.lastPage,
      length: data.data.length,
    };
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({ description: 'Retrieves a single product based on ID', type: ExpandedProductEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<ExpandedProductEntity> {
    const product = await this.productService.findBySlug(slug);

    if (!product) {
      throw new NotFoundException('Товар не знайдено!');
    }

    return new ExpandedProductEntity(product);
  }
}
