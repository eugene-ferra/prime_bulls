import { ApiProperty } from '@nestjs/swagger';

export class TopicEntity {
  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;
}

export class PostTopicEntity {
  id: number;
  postId: number;
  topicId: number;
  @ApiProperty({ type: () => [TopicEntity] })
  topics?: TopicEntity[];
}
