import { FileTypeValidator, Injectable, MaxFileSizeValidator, ParseFilePipe } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe extends ParseFilePipe {
  constructor() {
    super({
      validators: [
        new MaxFileSizeValidator({ maxSize: 1024 * 1024 * 2, message: 'Максимальний розмір файлу - 2 Мб' }),
        new FileTypeValidator({ fileType: /image\/(jpeg|png)/ }),
      ],
      fileIsRequired: false,
    });
  }
}
