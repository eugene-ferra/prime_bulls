import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseFormatInterceptor } from './interceptors/responseFormat.interceptor.js';
import { ParseQueryPipe } from './pipes/parseQuery.pipe.js';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ParseQueryPipe(),
    new ValidationPipe({
      transform: true,
      whitelist: true,
      exceptionFactory: (validationErrors: []) => {
        return new BadRequestException(validationErrors);
      },
    }),
  );
  app.useGlobalInterceptors(new ResponseFormatInterceptor());
  await app.listen(3000);
}
bootstrap();
