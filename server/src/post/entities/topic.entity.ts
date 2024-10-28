import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose } from 'class-transformer';

@Exclude()
export class TopicEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  slug: string;

  constructor(partial: Partial<TopicEntity>) {
    Object.assign(this, partial);
  }
}

@Exclude()
export class PostTopicEntity {
  id: number;
  postId: number;
  topicId: number;
  @ApiProperty({ type: () => [TopicEntity] })
  @Expose()
  topics?: TopicEntity[];
}
