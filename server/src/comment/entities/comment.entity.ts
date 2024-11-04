import { ApiProperty } from '@nestjs/swagger';
import { ReplyEntity } from './reply.entity.js';
import { Comment } from '../types/comment.type.js';

export class CommentEntity extends ReplyEntity {
  @ApiProperty({ type: () => [CommentEntity] })
  replies?: CommentEntity[];

  constructor(comment: Comment) {
    super(comment);
    this.replies = comment.comments?.map((item) => new ReplyEntity(item));
  }
}
