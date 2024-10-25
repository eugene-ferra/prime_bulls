import { Exclude, Expose, Transform } from 'class-transformer';
import { CommentAuthorEntity } from './commentAuthorEntity.js';
import { ApiProperty } from '@nestjs/swagger';

@Exclude()
export class CommentEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  parentCommentId: number;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty({ type: () => CommentAuthorEntity })
  @Expose()
  @Transform(({ obj }) => new CommentAuthorEntity(obj.user))
  user: CommentAuthorEntity;

  @ApiProperty({ type: () => [CommentEntity] })
  @Expose()
  @Transform(({ value }) => value?.map((item: CommentEntity) => new CommentEntity(item)))
  comments?: CommentEntity[];

  @ApiProperty()
  @Expose()
  replyCount?: number;

  constructor(partial: Partial<CommentEntity>) {
    Object.assign(this, partial);
  }
}
