import { ApiProperty } from '@nestjs/swagger';
import { CategoryEntity } from './category.entity.js';
import { ImageEntity } from '../../common/entities/image.entity.js';
import { SimpleProduct } from '../types/SimpleProduct.type.js';

export class SimpleProductEntity {
  @ApiProperty()
  readonly id: number;

  @ApiProperty()
  readonly title: string;

  @ApiProperty()
  readonly slug: string;

  @ApiProperty()
  readonly subtitle?: string;

  @ApiProperty()
  readonly category: CategoryEntity;

  @ApiProperty()
  readonly basePrice: number;

  @ApiProperty()
  readonly salePercent: number;

  @ApiProperty()
  readonly coverImage: ImageEntity;

  @ApiProperty()
  readonly isActive: boolean;

  @ApiProperty()
  readonly avgRating: number;

  @ApiProperty()
  readonly reviewCount: number;

  constructor(product: SimpleProduct) {
    this.id = product.id;
    this.title = product.title;
    this.slug = product.slug;
    this.subtitle = product.subtitle || null;
    this.category = new CategoryEntity(product.category);
    this.basePrice = product.basePrice;
    this.salePercent = product.salePercent;
    this.coverImage = new ImageEntity({
      url: product.coverImageUrl,
      altText: product.coverImageAltText,
    });
    this.isActive = product.isActive;
    this.reviewCount = product.reviewCount;
    this.avgRating = product.avgReview;
  }
}
