import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  ClassSerializerInterceptor,
  Query,
  NotFoundException,
  UseGuards,
  Req,
  UploadedFiles,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
  BadRequestException,
} from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { CreateReviewDto } from './dto/createReview.dto.js';
import { UpdateReviewDto } from './dto/updateReview.dto.js';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiCreatedResponse,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { ReviewEntity } from './entities/review.entity.js';
import { FilterReviewDto } from './dto/filterReview.dto.js';
import { AccessGuard } from '../common/guards/access.guard.js';
import { FilesInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiPaginatedResponse } from '../common/decorators/apiPaginatedResponse.decorator.js';
import { Pagination } from '../common/types/IPagination.type.js';

@ApiTags('reviews')
@ApiBadRequestResponse()
@ApiUnauthorizedResponse()
@ApiNotFoundResponse()
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiPaginatedResponse(ReviewEntity)
  @UseInterceptors(ClassSerializerInterceptor)
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

  @ApiCreatedResponse()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        files: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiOkResponse({ type: ReviewEntity })
  @UseGuards(AccessGuard)
  @UseInterceptors(FilesInterceptor('files', 5), ClassSerializerInterceptor)
  @Post('/')
  async createComment(
    @Req() req: Request,
    @Body() body: CreateReviewDto,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2, message: 'Максимальний розмір файлу - 2 Мб' }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
  ): Promise<ReviewEntity> {
    const review = await this.reviewService.create(req.user.id, body, files);
    return new ReviewEntity(review);
  }

  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiOkResponse({ type: ReviewEntity })
  @UseInterceptors(FilesInterceptor('files', 5), ClassSerializerInterceptor)
  @UseGuards(AccessGuard)
  @Patch(':id')
  async updateComment(
    @Req() req: Request,
    @Body() body: UpdateReviewDto,
    @Param('id') id: number,
    @UploadedFiles(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2, message: 'Максимальний розмір файлу - 2 Мб' }),
          new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }),
        ],
        fileIsRequired: false,
      }),
    )
    files: Express.Multer.File[],
  ): Promise<ReviewEntity> {
    if (!id) throw new BadRequestException('Такого коментаря не існує!');

    await this.reviewService.update(id, req.user.id, body, files);
    return;
  }

  @ApiUnauthorizedResponse()
  @ApiForbiddenResponse()
  @ApiOkResponse()
  @UseGuards(AccessGuard)
  @Delete(':id')
  async deleteComment(@Req() req: Request, @Param('id') id: number) {
    if (!id) throw new BadRequestException('Такого коментаря не існує!');

    return await this.reviewService.delete(id, req.user.id);
  }
}

@ApiTags('reviews')
@ApiBadRequestResponse()
@ApiOkResponse({ type: ReviewEntity })
@UseGuards(AccessGuard)
@UseInterceptors(ClassSerializerInterceptor)
@Controller('reviews/:id/like')
export class ReviewLikeController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  async addLikeToComment(@Param('id') id: number, @Req() req: Request): Promise<ReviewEntity> {
    const review = await this.reviewService.addlike(id, req.user.id);
    return new ReviewEntity(review);
  }

  @Delete('/')
  async removelikeFromComment(@Param('id') id: number, @Req() req: Request): Promise<ReviewEntity> {
    const doc = await this.reviewService.removeLike(id, req.user.id);
    return new ReviewEntity(doc);
  }
}
