import {
  ClassSerializerInterceptor,
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
  UseInterceptors,
} from '@nestjs/common';
import { PostService } from './post.service.js';
import { ApiBadRequestResponse, ApiNotFoundResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { FilterPostsDto } from './dto/filterPosts.dto.js';
import { SimplePostEntity } from './entities/simplePost.entity.js';
import { TopicEntity } from './entities/topic.entity.js';
import { TopicService } from './topic.service.js';
import { AccessGuard } from '../common/guards/access.guard.js';
import { Request } from 'express';

@ApiTags('posts')
@Controller('posts')
export class PostController {
  constructor(
    private readonly postService: PostService,
    private readonly topicService: TopicService,
  ) {}

  @ApiOkResponse({ description: 'Retrieves all posts topics', type: [TopicEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get('/topics')
  async getCategories() {
    const docs = await this.topicService.findAll();

    return docs.map((item) => new TopicEntity(item));
  }

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
  async findOne(
    @Param('slug') slug: string,
    @Ip() ip: string,
    @Headers('user-agent') userAgent: string,
  ): Promise<SimplePostEntity> {
    const post = await this.postService.findBySlug(slug);

    if (!post) {
      throw new NotFoundException('Статтю не знайдено!');
    }

    await this.postService.addView(post.id, { ip, userAgent });

    return new SimplePostEntity(post);
  }

  @ApiBadRequestResponse()
  @ApiOkResponse()
  @UseGuards(AccessGuard)
  @Post(':id/like')
  async addLikeToComment(@Param('id') id: number, @Req() req: Request) {
    await this.postService.addlike(id, req.user.id);

    return;
  }

  @ApiBadRequestResponse()
  @ApiOkResponse()
  @UseGuards(AccessGuard)
  @Delete(':id/like')
  async removelikeFromComment(@Param('id') id: number, @Req() req: Request) {
    await this.postService.removeLike(id, req.user.id);
    return;
  }
}
