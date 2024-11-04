import {
  Controller,
  Delete,
  Get,
  Headers,
  Ip,
  NotFoundException,
  Param,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { PostService } from './post.service.js';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterPostsDto } from './dto/filterPosts.dto.js';
import { SimplePostEntity } from './entities/simplePost.entity.js';
import { TopicEntity } from './entities/topic.entity.js';
import { TopicService } from './topic.service.js';
import { AccessGuard } from '../common/guards/access.guard.js';
import { Request } from 'express';
import { ApiPaginatedResponse } from '../common/decorators/apiPaginatedResponse.decorator.js';
import { Pagination } from '../common/types/IPagination.type.js';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly topicService: TopicService,
  ) {}

  @ApiPaginatedResponse(SimplePostEntity)
  @Get('/topics')
  async getCategories(): Promise<Pagination<TopicEntity>> {
    const docs = await this.topicService.findAll();

    return {
      docs: docs.map((item) => new TopicEntity(item)),
      totalDocs: docs.length,
      currentPage: 1,
      totalPages: 1,
    };
  }

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

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: SimplePostEntity })
  @Get(':slug')
  async findOne(
    @Param('slug') slug: string,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ): Promise<SimplePostEntity> {
    const post = await this.postService.findBySlug(slug);

    if (!post) {
      throw new NotFoundException('Статтю не знайдено!');
    }

    const doc = await this.postService.addView(post.id, { ip, userAgent });

    return new SimplePostEntity(doc);
  }
}

@ApiBadRequestResponse()
@ApiOkResponse({ type: SimplePostEntity })
@UseGuards(AccessGuard)
@Controller('posts/:id/like')
export class PostLikesController {
  constructor(private readonly postService: PostService) {}

  @Post('/')
  async addLikeToComment(@Param('id') id: number, @Req() req: Request): Promise<SimplePostEntity> {
    const doc = await this.postService.addlike(id, req.user.id);

    return new SimplePostEntity(doc);
  }

  @Delete('/')
  async removelikeFromComment(@Param('id') id: number, @Req() req: Request): Promise<SimplePostEntity> {
    const doc = await this.postService.removeLike(id, req.user.id);
    return new SimplePostEntity(doc);
  }
}
