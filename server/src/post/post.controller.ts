import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { PostService } from './post.service.js';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterPostsDto } from './dto/filterPosts.dto.js';
import { getFiltersFromQuery } from './getFiltersFromQuery.js';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Get('/')
  async findAll(@Query() query: FilterPostsDto) {
    const { where, page, limit } = getFiltersFromQuery(query);
    const products = await this.postService.findAll({ where, page, limit });

    if (!products.data.length) throw new NotFoundException();

    return products;
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse()
  @Get(':slug')
  async findOne(@Param('slug') slug: string) {
    const product = await this.postService.findBySlug(slug);

    if (!product) {
      throw new NotFoundException();
    }

    return product;
  }
}
