import { ApiProperty } from '@nestjs/swagger';
import { Topic } from '../types/topic.type.js';

export class TopicEntity {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly slug: string;

  constructor(data: Topic) {
    this.id = data.id;
    this.name = data.name;
    this.slug = data.slug;
  }
}
