import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
} from '@nestjs/common';
import { CommentService } from '../services/comment.service.js';
import { AccessGuard } from '../../common/guards/access.guard.js';
import { CreateCommentDto } from '../dto/createComment.dto.js';
import { UpdateCommentDto } from '../dto/updateComment.dto.js';
import { FilterCommentsDto } from '../dto/filterComment.dto.js';
import { CommentEntity } from '../entities/comment.entity.js';
import {
  ApiBadRequestResponse,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';
import { ApiPaginatedResponse } from '../../common/decorators/apiPaginatedResponse.decorator.js';
import { Pagination } from '../../common/types/IPagination.type.js';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';

@ApiTags('comments')
@ApiBadRequestResponse()
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiNotFoundResponse()
  @ApiPaginatedResponse(CommentEntity)
  @Get('/')
  async findAll(@Query() query: FilterCommentsDto): Promise<Pagination<CommentEntity>> {
    const data = await this.commentService.findAll(query);

    if (!data.data.length) throw new NotFoundException('Коментарів не знайдено!');

    return {
      docs: data.data.map((item) => {
        return new CommentEntity(item);
      }),
      totalDocs: data.data.length,
      totalPages: data.lastPage,
      currentPage: query.page || 1,
    };
  }

  @ApiUnauthorizedResponse()
  @ApiSingleResponse(CommentEntity, 201)
  @UseGuards(AccessGuard)
  @Post('/')
  async createComment(@Req() req: Request, @Body() body: CreateCommentDto): Promise<CommentEntity> {
    const doc = await this.commentService.create(req.user.id, body);
    return new CommentEntity(doc);
  }

  @ApiUnauthorizedResponse()
  @ApiSingleResponse(CommentEntity)
  @UseGuards(AccessGuard)
  @Patch(':id')
  async updateComment(
    @Req() req: Request,
    @Body() body: UpdateCommentDto,
    @Param('id') id: number,
  ): Promise<CommentEntity> {
    if (!id) throw new BadRequestException('Такого коментаря не існує!');

    const doc = await this.commentService.update(id, req.user.id, body);
    return new CommentEntity(doc);
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(AccessGuard)
  @Delete(':id')
  async deleteComment(@Req() req: Request, @Param('id') id: number) {
    if (!id) throw new BadRequestException('Такого коментаря не існує!');

    return await this.commentService.delete(id, req.user.id);
  }
}
