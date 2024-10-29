import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { PostTopicEntity, TopicEntity } from './topic.entity.js';

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

  @ApiProperty({ type: () => ImageEntity })
  @Expose()
  @Transform(({ obj }) => new ImageEntity({ url: obj.coverImageUrl, altText: obj.coverImageAltText }))
  coverImage?: ImageEntity;

  @ApiProperty({ type: () => [TopicEntity] })
  @Expose()
  @Transform(({ value }) => value.map((item) => new TopicEntity(item.topic)))
  topics?: PostTopicEntity[];

  @ApiProperty()
  @Expose()
  @Transform(({ value }) => value?.map((item) => ({ userId: item.userId })))
  likes?: any[];

  @ApiProperty()
  @Expose()
  @Transform(({ obj }) => obj.views.length)
  views: any;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  constructor(partial: SimplePostEntity) {
    Object.assign(this, partial);
  }
}
