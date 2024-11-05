import { Controller, Get, NotFoundException, Param, Query } from '@nestjs/common';
import { PostService } from '../services/post.service.js';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterPostsDto } from '../dto/filterPosts.dto.js';
import { SimplePostEntity } from '../entities/simplePost.entity.js';
import { ApiPaginatedResponse } from '../../common/decorators/apiPaginatedResponse.decorator.js';
import { Pagination } from '../../common/types/IPagination.type.js';
import { Device } from '../../common/decorators/device.decorator.js';
import { DeviceDto } from '../../common/dto/device.dto.js';
import { PostViewService } from '../services/postViewService.js';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly viewService: PostViewService,
  ) {}

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiPaginatedResponse(SimplePostEntity)
  @Get('/')
  async findAll(@Query() query: FilterPostsDto): Promise<Pagination<SimplePostEntity>> {
    const data = await this.postService.findAll(query);

    if (!data.data.length) throw new NotFoundException('Статей за вказаними параметрами не знайдено!');

    return {
      docs: data.data.map((item) => {
        return new SimplePostEntity(item);
      }),
      totalDocs: data.data.length,
      currentPage: query.page || 1,
      totalPages: data.lastPage,
    };
  }

  @ApiNotFoundResponse()
  @ApiOkResponse({ type: SimplePostEntity })
  @Get(':slug')
  async findOne(@Param('slug') slug: string, @Device() device: DeviceDto): Promise<SimplePostEntity> {
    const post = await this.postService.findBySlug(slug);
    if (!post) throw new NotFoundException('Статтю не знайдено!');

    await this.viewService.addView(post, device);

    return new SimplePostEntity(post);
  }
}
