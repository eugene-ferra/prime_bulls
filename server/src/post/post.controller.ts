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
import { SimplePostEntity } from './dto/simplePostEntity.js';

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
    const { where, page, limit } = this.postService.toPrismaSearch(query);
    const data = await this.postService.findAll({
      where,
      include: { topics: { include: { topic: true } } },
      page,
      limit,
    });

    if (!data.length) throw new NotFoundException();

    const docs = await this.postService.countDocs(where);

    return {
      data: data.map((item) => {
        return new SimplePostEntity(item);
      }),
      currentPage: page,
      lastPage: Math.ceil(docs / limit),
      length: data.length,
    };
  }

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({
    description: 'Retrieves posts based on slug',
    type: SimplePostEntity,
  })
  @Get(':slug')
  async findOne(@Param('slug') slug: string): Promise<SimplePostEntity> {
    const post = await this.postService.findBySlug(slug, { topics: { include: { topic: true } } });

    if (!post) {
      throw new NotFoundException();
    }

    return new SimplePostEntity(post);
  }
}
