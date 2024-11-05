import { ApiBadRequestResponse, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { SimplePostEntity } from '../entities/simplePost.entity.js';
import { Controller, Delete, NotFoundException, Param, Post, Req, UseGuards } from '@nestjs/common';
import { AccessGuard } from '../../common/guards/access.guard.js';
import { PostService } from '../services/post.service.js';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';
import { Request } from 'express';
import { PostLikeService } from '../services/postLikeService.js';

@ApiTags('posts')
@ApiBadRequestResponse()
@ApiUnauthorizedResponse()
@ApiSingleResponse(SimplePostEntity)
@UseGuards(AccessGuard)
@Controller('posts/:id/like')
export class PostLikesController {
  constructor(
    private readonly postService: PostService,
    private readonly likeService: PostLikeService,
  ) {}

  @Post('/')
  async addLikeToComment(@Param('id') id: number, @Req() req: Request): Promise<SimplePostEntity> {
    const doc = await this.postService.findById(id);
    if (!doc) throw new NotFoundException('Статтю не знайдено!');

    await this.likeService.addlike(doc, req.user.id);
    const updatedDoc = await this.postService.findById(id);

    return new SimplePostEntity(updatedDoc);
  }

  @Delete('/')
  async removelikeFromComment(@Param('id') id: number, @Req() req: Request): Promise<SimplePostEntity> {
    await this.likeService.removeLike(id, req.user.id);

    const doc = await this.postService.findById(id);
    return new SimplePostEntity(doc);
  }
}
