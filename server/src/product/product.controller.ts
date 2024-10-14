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
import { ExpandedProductEntity } from './dto/expandedProductEntity.js';
import { SimpleProductEntity } from './dto/simpleProductEntity.js';

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
  @Get('/')
  async findAll(@Query() query: FilterProductsDto) {
    const { where, page, limit, orderBy } = this.productService.toPrismaSearch(query);
    const products = await this.productService.findAll({
      where,
      orderBy,
      page,
      limit,
      include: { category: true },
    });
    const docs = await this.productService.countDocs(where);

    if (!products.length) throw new NotFoundException();

    return {
      data: products.map((item) => {
        return new SimpleProductEntity(item);
      }),
      currentPage: page,
      lastPage: Math.ceil(docs / limit),
      length: products.length,
    };
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({ description: 'Retrieves a single product based on ID', type: ExpandedProductEntity })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<ExpandedProductEntity> {
    const product = await this.productService.findBySlug(slug, {
      category: true,
      images: true,
      attributes: {
        include: { attribute: true },
      },
      productVariants: {
        include: { variant: true },
      },
    });

    if (!product) {
      throw new NotFoundException();
    }

    return new ExpandedProductEntity(product);
  }
}
