import { ApiProperty } from '@nestjs/swagger';
import { Topic } from '../types/topic.type.js';

export class TopicEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  slug: string;

  constructor(data: Topic) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
  }
}
