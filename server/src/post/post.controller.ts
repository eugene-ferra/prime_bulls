import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  NotFoundException,
  Param,
  Query,
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service.js';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterPostsDto } from './dto/filterPosts.dto.js';
import { SimplePostEntity } from './entities/simplePost.entity.js';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({
    description: 'Retrieves all posts based on query string with filters and pagination',
    type: [SimplePostEntity],
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/')
  async findAll(@Query() query: FilterPostsDto) {
    const data = await this.postService.findAll(query);

    if (!data.data.length) throw new NotFoundException('Статей за вказаними параметрами не знайдено!');

    return {
      docs: data.data.map((item) => {
        return new SimplePostEntity(item);
      }),
      lastPage: data.lastPage,
      length: data.data.length,
    };
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({
    description: 'Retrieves posts based on slug',
    type: SimplePostEntity,
  })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<SimplePostEntity> {
    const post = await this.postService.findBySlug(slug);

    if (!post) {
      throw new NotFoundException('Статтю не знайдено!');
    }

    return new SimplePostEntity(post);
  }
}
