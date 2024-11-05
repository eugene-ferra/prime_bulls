import { ApiBadRequestResponse, ApiTags } from '@nestjs/swagger';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';
import { CommentEntity } from '../entities/comment.entity.js';
import { Controller, Delete, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../../common/guards/access.guard.js';
import { CommentService } from '../services/comment.service.js';
import { CommentLikeService } from '../services/commentLike.service.js';
import { Request } from 'express';

@ApiTags('comments')
@ApiBadRequestResponse()
@UseGuards(AccessGuard)
@Controller('comments/:id/likes')
export class CommentLikesController {
  constructor(
    private readonly commentService: CommentService,
    private readonly likesService: CommentLikeService,
  ) {}

  @ApiSingleResponse(CommentEntity)
  @Post('/')
  async addLikeToComment(@Param('id') id: number, @Req() req: Request): Promise<CommentEntity> {
    const doc = await this.commentService.findById(id);
    if (!doc) throw new NotFoundException('Коментар не знайдено!');

    await this.likesService.addlike(doc, req.user.id);
    const updatedDoc = await this.commentService.findById(id);

    return new CommentEntity(updatedDoc);
  }

  @ApiSingleResponse(CommentEntity)
  @Delete(':id/like')
  async removelikeFromComment(@Param('id') id: number, @Req() req: Request): Promise<CommentEntity> {
    await this.likesService.removeLike(id, req.user.id);

    const doc = await this.commentService.findById(id);
    if (!doc) throw new NotFoundException('Коментар не знайдено!');

    return new CommentEntity(doc);
  }
}
