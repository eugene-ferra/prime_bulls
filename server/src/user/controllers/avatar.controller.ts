import { Controller, UseGuards, Req, UseInterceptors, Patch, Delete, UploadedFile } from '@nestjs/common';
import { UserService } from '../services/user.service.js';
import { AccessGuard } from '../../common/guards/access.guard.js';
import { UserEntity } from '../entities/user.entity.js';
import { ApiBadRequestResponse, ApiConsumes, ApiTags, ApiUnauthorizedResponse } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { ApiSingleResponse } from '../../common/decorators/apiSingleResponse.decorator.js';
import { ImageValidationPipe } from '../../common/pipes/imageValidation.pipe.js';

@ApiTags('users')
@UseGuards(AccessGuard)
@ApiUnauthorizedResponse()
@ApiBadRequestResponse()
@ApiSingleResponse(UserEntity)
@Controller('users')
export class AvatarController {
  constructor(private readonly userService: UserService) {}

  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  @Patch('/me/avatar')
  async changeAvatar(
    @UploadedFile(ImageValidationPipe)
    file: Express.Multer.File,
    @Req() req: Request,
  ): Promise<UserEntity> {
    const user = await this.userService.updateAvatar(req.user.id, file);

    return new UserEntity(user);
  }

  @Delete('/me/avatar')
  async deleteAvatar(@Req() req: Request): Promise<UserEntity> {
    const user = await this.userService.deleteAvatar(req.user.id);

    return new UserEntity(user);
  }
}
