import { Exclude, Expose, Transform } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { AuthorEntity } from '../../common/entities/author.entity.js';

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

  @ApiProperty({ type: () => AuthorEntity })
  @Expose()
  @Transform(({ obj }) => new AuthorEntity(obj.user))
  user: AuthorEntity;

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
