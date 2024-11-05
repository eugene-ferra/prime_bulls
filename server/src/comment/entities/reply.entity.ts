import { ApiProperty } from '@nestjs/swagger';
import { AuthorEntity } from '../../common/entities/author.entity.js';
import { Reply } from '../types/reply.type.js';

export class ReplyEntity {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly parentCommentId: number;

  @ApiProperty()
  readonly content: string;

  @ApiProperty({ type: AuthorEntity })
  readonly user: AuthorEntity;

  @ApiProperty()
  readonly replyCount: number;

  @ApiProperty()
  readonly likes: number;

  constructor(reply: Reply) {
    this.id = reply.id;
    this.parentCommentId = reply.parentCommentId;
    this.content = reply.content;
    this.user = new AuthorEntity(reply.user);
    this.replyCount = reply.replyCount;
    this.likes = reply.likes.length;
  }
}
