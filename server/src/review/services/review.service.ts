import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateReviewDto } from '../dto/createReview.dto.js';
import { UpdateReviewDto } from '../dto/updateReview.dto.js';
import { FilterReviewDto } from '../dto/filterReview.dto.js';
import { Review } from '../types/review.type.js';
import { PaginatedResult } from '../../common/types/paginatedResult.type.js';
import { ReviewRepository } from './reviewRepository.service.js';
import { ImageService } from '../../file/image.service.js';
import { ReviewLikeService } from './reviewLike.service.js';

@Injectable()
export class ReviewService {
  constructor(
    private readonly reviewRepository: ReviewRepository,
    private readonly likeService: ReviewLikeService,
    private readonly imageService: ImageService,
  ) {}

  private folder = 'reviews';

  async create(userId: number, data: CreateReviewDto, files?: Express.Multer.File[]): Promise<Review> {
    const savedReview = await this.reviewRepository.save(userId, data.productId, data);

    const images = await this.imageService.saveImages(files, { id: savedReview.id, bucketName: this.folder });
    await this.reviewRepository.saveImageUrls(images, savedReview.id);

    return await this.reviewRepository.findOne(savedReview.id);
  }

  async delete(id: number, userId: number): Promise<void> {
    const review = await this.reviewRepository.findOne(id);

    if (!review) throw new BadRequestException('Відгук не знайдено!');
    if (review.userId !== userId) throw new BadRequestException('Ви не маєте права видаляти цей відгук!');

    const imagesUrls = review.images.map((image) => image.url);
    await this.imageService.deleteImages(this.folder, imagesUrls);
    await this.reviewRepository.delete(id);
  }

  async update(id: number, user: number, data: UpdateReviewDto, files?: Express.Multer.File[]) {
    const review = await this.findById(id);

    if (!review) throw new BadRequestException('Відгук не знайдено!');
    if (review.userId !== user) throw new BadRequestException('Ви не маєте права редагувати цей відгук!');

    await this.reviewRepository.update(id, data);

    if (files.length) {
      const filesUrls = review.images.map((image) => image.url);

      await this.imageService.deleteImages(this.folder, filesUrls);
      await this.imageService.saveImages(files, { id, bucketName: this.folder });
    }

    return await this.reviewRepository.findOne(id);
  }

  async findAll(payload: FilterReviewDto): Promise<PaginatedResult<Review>> {
    return await this.reviewRepository.findAll(payload);
  }

  async findById(id: number): Promise<Review> {
    return await this.reviewRepository.findOne(id);
  }

  async addLike(reviewId: number, userId: number): Promise<Review> {
    await this.likeService.addlike(reviewId, userId);

    return await this.reviewRepository.findOne(reviewId);
  }

  async removeLike(reviewId: number, userId: number): Promise<Review> {
    await this.likeService.removeLike(reviewId, userId);

    return await this.reviewRepository.findOne(reviewId);
  }
}
