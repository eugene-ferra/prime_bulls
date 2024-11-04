import { ApiProperty } from '@nestjs/swagger';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { TopicEntity } from './topic.entity.js';
import { Post } from '../types/Post.type.js';

export class SimplePostEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  slug: string;

  @ApiProperty()
  content: string;

  @ApiProperty({ type: () => ImageEntity })
  coverImage: ImageEntity;

  @ApiProperty({ type: () => [TopicEntity] })
  topics: TopicEntity[];

  @ApiProperty()
  likes: number;

  @ApiProperty()
  views: number;

  @ApiProperty()
  createdAt: Date;

  constructor(post: Post) {
    this.id = post.id;
    this.title = post.title;
    this.slug = post.slug;
    this.content = post.content;
    this.coverImage = new ImageEntity({ url: post.coverImageUrl, altText: post.coverImageAltText });
    this.topics = post.topics.map((topic) => new TopicEntity(topic.topic));
    this.likes = post.likes.length;
    this.views = post.views.length;
    this.createdAt = post.createdAt;
  }
}
