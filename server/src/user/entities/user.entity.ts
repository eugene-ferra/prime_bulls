import { ApiProperty } from '@nestjs/swagger';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { User } from '../types/user.type.js';
import { AddressEntity } from './address.entity.js';

export class UserEntity {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  email: string;

  @ApiProperty()
  avatar: ImageEntity;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  role: string;

  @ApiProperty()
  reviews: number[];

  @ApiProperty()
  comments: number[];

  @ApiProperty()
  commentLikes: number[];

  @ApiProperty()
  reviewLikes: number[];

  @ApiProperty()
  postLikes: number[];

  @ApiProperty()
  savedProducts: number[];

  @ApiProperty()
  addresses: AddressEntity[];

  constructor(user: User) {
    this.id = user.id;
    this.name = user.name;
    this.lastName = user.lastName;
    this.phone = user.phone;
    this.email = user.email;
    this.avatar = new ImageEntity({ url: user.imageUrl, altText: user.altText });
    this.createdAt = user.createdAt;
    this.role = user.role;
    this.reviews = this.getIdsArray(user.reviews);
    this.comments = this.getIdsArray(user.comments);
    this.commentLikes = this.getIdsArray(user.commentLikes);
    this.reviewLikes = this.getIdsArray(user.reviewLikes);
    this.postLikes = this.getIdsArray(user.postLikes);
    this.savedProducts = this.getIdsArray(user.savedProducts);
    this.addresses = user.addresses.map((address) => new AddressEntity(address));
  }

  private getIdsArray(arr: { id: number }[]): number[] {
    return arr.map((item) => item.id);
  }
}
