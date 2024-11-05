import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  Query,
  NotFoundException,
  UseGuards,
  Req,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { ReviewService } from '../services/review.service.js';
import { CreateReviewDto } from '../dto/createReview.dto.js';
import { UpdateReviewDto } from '../dto/updateReview.dto.js';
import {
  ApiBadRequestResponse,
  ApiConsumes,
  ApiNoContentResponse,
  ApiNotFoundResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReviewEntity } from '../entities/review.entity.js';
import { FilterReviewDto } from '../dto/filterReview.dto.js';
import { AccessGuard } from '../../common/guards/access.guard.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiPaginatedResponse } from '../../common/decorators/apiPaginatedResponse.decorator.js';
import { Pagination } from '../../common/types/IPagination.type.js';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';
import { ImageValidationPipe } from '../../common/pipes/imageValidation.pipe.js';

@ApiTags('reviews')
@ApiBadRequestResponse()
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiNotFoundResponse()
  @ApiPaginatedResponse(ReviewEntity)
  @Get('/')
  async findAll(@Query() query: FilterReviewDto): Promise<Pagination<ReviewEntity>> {
    const data = await this.reviewService.findAll(query);

    if (!data.data.length) throw new NotFoundException('Коментарів не знайдено!');

    return {
      docs: data.data.map((item) => {
        return new ReviewEntity(item);
      }),
      totalDocs: data.data.length,
      currentPage: query.page || 1,
      totalPages: data.lastPage,
    };
  }

  @ApiUnauthorizedResponse()
  @ApiConsumes('multipart/form-data')
  @ApiSingleResponse(ReviewEntity)
  @UseGuards(AccessGuard)
  @UseInterceptors(FilesInterceptor('files', 5))
  @Post('/')
  async createComment(
    @Req() req: Request,
    @Body() body: CreateReviewDto,
    @UploadedFiles(ImageValidationPipe) files: Express.Multer.File[],
  ): Promise<ReviewEntity> {
    const review = await this.reviewService.create(req.user.id, body, files);
    return new ReviewEntity(review);
  }

  @ApiUnauthorizedResponse()
  @ApiSingleResponse(ReviewEntity)
  @UseInterceptors(FilesInterceptor('files', 5))
  @UseGuards(AccessGuard)
  @Patch(':id')
  async updateComment(
    @Req() req: Request,
    @Body() body: UpdateReviewDto,
    @Param('id') id: number,
    @UploadedFiles(ImageValidationPipe) files: Express.Multer.File[],
  ): Promise<ReviewEntity> {
    if (!id) throw new BadRequestException('Такого коментаря не існує!');

    await this.reviewService.update(id, req.user.id, body, files);
    return;
  }

  @ApiNoContentResponse()
  @ApiUnauthorizedResponse()
  @UseGuards(AccessGuard)
  @Delete(':id')
  async deleteComment(@Req() req: Request, @Param('id') id: number) {
    if (!id) throw new BadRequestException('Такого коментаря не існує!');

    return await this.reviewService.delete(id, req.user.id);
  }
}
