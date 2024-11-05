import { Controller, Get, NotFoundException } from '@nestjs/common';
import { ApiPaginatedResponse } from '../../common/decorators/apiPaginatedResponse.decorator.js';
import { TopicEntity } from '../entities/topic.entity.js';
import { Pagination } from '../../common/types/IPagination.type.js';
import { TopicService } from '../services/topic.service.js';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('topics')
@Controller('topics')
export class PostTopicController {
  constructor(private readonly topicService: TopicService) {}

  @ApiNotFoundResponse()
  @ApiPaginatedResponse(TopicEntity)
  @Get('/')
  async getCategories(): Promise<Pagination<TopicEntity>> {
    const docs = await this.topicService.findAll();

    if (!docs.length) throw new NotFoundException('Категорій не знайдено!');

    return {
      docs: docs.map((item) => new TopicEntity(item)),
      totalDocs: docs.length,
      currentPage: 1,
      totalPages: 1,
    };
  }
}
