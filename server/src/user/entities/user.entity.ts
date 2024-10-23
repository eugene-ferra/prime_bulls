import { ApiProperty } from '@nestjs/swagger';
import { Exclude, Expose, Transform } from 'class-transformer';
import { UserImageEntity } from './userImageEntity.js';

@Exclude()
export class UserEntity {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty()
  name: string;

  @Expose()
  @ApiProperty()
  lastName?: string;

  @Expose()
  @ApiProperty()
  phone?: string;

  @Expose()
  @ApiProperty()
  email: string;

  @Expose()
  @ApiProperty()
  @Transform(({ obj }) => new UserImageEntity({ url: obj.imageUrl, altText: obj.altText }))
  avatar: UserImageEntity;

  @Expose()
  @ApiProperty()
  isVerified: boolean;

  @Expose()
  @ApiProperty()
  createdAt: Date;

  @Expose()
  @ApiProperty()
  role: string;

  constructor(partial: Partial<UserEntity>) {
    Object.assign(this, partial);
  }
}
