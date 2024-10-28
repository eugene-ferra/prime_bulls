import {
  BadRequestException,
  Body,
  ClassSerializerInterceptor,
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
  UseInterceptors,
} from '@nestjs/common';
import { CommentService } from './comment.service.js';
import { AccessGuard } from '../common/guards/access.guard.js';
import { CreateCommentDto } from './dto/createComment.dto.js';
import { UpdateCommentDto } from './dto/updateComment.dto.js';
import { FilterCommentsDto } from './dto/filterComment.dto.js';
import { CommentEntity } from './entities/comment.entity.js';
import {
  ApiBadRequestResponse,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Request } from 'express';

@ApiTags('comments')
@Controller('comments')
export class CommentController {
  constructor(private readonly commentService: CommentService) {}

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [CommentEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Query() query: FilterCommentsDto) {
    const data = await this.commentService.findAll(query);

    if (!data.data.length) throw new NotFoundException('Коментарів не знайдено!');

    return {
      docs: data.data.map((item) => {
        return new CommentEntity(item);
      }),
      lastPage: data.lastPage,
      length: data.data.length,
    };
  }

  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiCreatedResponse()
  @UseGuards(AccessGuard)
  @Post()
  async createComment(@Req() req: Request, @Body() body: CreateCommentDto): Promise<CommentEntity> {
    await this.commentService.create(req.user.id, body);
    return;
  }

  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @UseGuards(AccessGuard)
  @Patch(':id')
  async updateComment(@Req() req: Request, @Body() body: UpdateCommentDto, @Param('id') id: number) {
    if (!id) throw new BadRequestException('Такого коментаря не існує!');

    await this.commentService.update(id, req.user.id, body);
    return;
  }

  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiBadRequestResponse()
  @ApiOkResponse()
  @UseGuards(AccessGuard)
  @Delete(':id')
  async deleteComment(@Req() req: Request, @Param('id') id: number) {
    if (!id) throw new BadRequestException('Такого коментаря не існує!');

    return await this.commentService.delete(id, req.user.id);
  }
}
