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
} from '@nestjs/common';
import { ReviewService } from './review.service.js';
import { CreateReviewDto } from './dto/create-review.dto.js';
import { UpdateReviewDto } from './dto/update-review.dto.js';
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
import { FilterReviewDto } from './dto/filter-review.dto.js';
import { AccessGuard } from '../guards/access.guard.js';
import { FilesInterceptor } from '@nestjs/platform-express';

@ApiTags('reviews')
@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @ApiBadRequestResponse()
  @ApiNotFoundResponse()
  @ApiOkResponse({ type: [ReviewEntity] })
  @UseInterceptors(ClassSerializerInterceptor)
  @Get()
  async findAll(@Query() query: FilterReviewDto) {
    const data = await this.reviewService.findAll(query);

    if (!data.data.length) throw new NotFoundException('Коментарів не знайдено!');

    return {
      docs: data.data.map((item) => {
        return new ReviewEntity(item);
      }),
      lastPage: data.lastPage,
      length: data.data.length,
    };
  }

  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiCreatedResponse()
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @UseGuards(AccessGuard)
  @UseInterceptors(FilesInterceptor('files', 5))
  @Post()
  async createComment(
    @Req() req,
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
    await this.reviewService.create(req.user.id, body, files);
    return;
  }

  @ApiBadRequestResponse()
  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiOkResponse()
  @UseInterceptors(FilesInterceptor('files', 5))
  @UseGuards(AccessGuard)
  @Patch(':id')
  async updateComment(
    @Req() req,
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
  ) {
    await this.reviewService.update(id, req.user.id, body, files);
    return;
  }

  @ApiUnauthorizedResponse()
  @ApiNotFoundResponse()
  @ApiForbiddenResponse()
  @ApiOkResponse()
  @UseGuards(AccessGuard)
  @Delete(':id')
  async deleteComment(@Req() req, @Param('id') id: number) {
    return await this.reviewService.delete(id, req.user.id);
  }
}
