import { ApiProperty } from '@nestjs/swagger';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { User } from '../types/user.type.js';
import { AddressEntity } from './address.entity.js';

export class UserEntity {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly name: string;

  @ApiProperty()
  readonly lastName: string;

  @ApiProperty()
  readonly phone: string;

  @ApiProperty()
  readonly email: string;

  @ApiProperty()
  readonly avatar: ImageEntity;

  @ApiProperty()
  readonly createdAt: Date;

  @ApiProperty()
  readonly role: string;

  @ApiProperty({ type: [Number] })
  readonly reviews: number[];

  @ApiProperty({ type: [Number] })
  readonly comments: number[];

  @ApiProperty({ type: [Number] })
  readonly commentLikes: number[];

  @ApiProperty({ type: [Number] })
  readonly reviewLikes: number[];

  @ApiProperty({ type: [Number] })
  readonly postLikes: number[];

  @ApiProperty({ type: [Number] })
  readonly savedProducts: number[];

  @ApiProperty({ type: [AddressEntity] })
  readonly addresses: AddressEntity[];

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
