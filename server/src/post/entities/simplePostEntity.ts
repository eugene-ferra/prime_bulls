import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { PostImageEntity } from './PostImageEntity.js';
import { PostTopicEntity, TopicEntity } from './topicEntity.js';

@Exclude()
export class SimplePostEntity {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  slug: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty({ type: () => PostImageEntity })
  @Expose()
  @Transform(({ obj }) => new PostImageEntity({ url: obj.coverImageUrl, altText: obj.coverImageAltText }))
  coverImage: PostImageEntity;

  @ApiProperty({ type: () => [TopicEntity] })
  @Expose()
  @Transform(({ value }) => value.map((item) => new TopicEntity(item.topic)))
  topics: PostTopicEntity[];

  // TODO: add views and likes data

  @ApiProperty()
  @Expose()
  createdAt: Date;

  constructor(partial: Partial<SimplePostEntity>) {
    Object.assign(this, partial);
  }
}
