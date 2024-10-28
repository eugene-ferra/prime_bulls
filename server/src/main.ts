import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module.js';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ResponseFormatInterceptor } from './common/interceptors/responseFormat.interceptor.js';
import { ParseQueryPipe } from './common/pipes/parseQuery.pipe.js';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import cookieParser from 'cookie-parser';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser());

  const config = new DocumentBuilder().setTitle('Prime Bulls API').setVersion('1.0').build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

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
