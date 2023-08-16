import { HttpAdapterHost, NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

import { ValidationError } from 'class-validator';
import {
  AllExceptionFilter,
  HttpExceptionFilter,
  RouteNotFoundFilter,
} from './global-filters';
import { TransformInterceptor } from './utils/interceptor';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const httpAdapterHost = app.get(HttpAdapterHost);
  const reflector = app.get(Reflector);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      exceptionFactory: (errors: ValidationError[]) => {
        const firstError = errors[0];
        const errorMessage = Object.values(firstError.constraints)[0];
        return new BadRequestException(errorMessage);
      },
    }),
  );
  app.useGlobalFilters(
    new HttpExceptionFilter(configService),
    new AllExceptionFilter(httpAdapterHost),
    new RouteNotFoundFilter(),
  );
  app.useGlobalInterceptors(new TransformInterceptor(reflector));

  await app.listen(8080);
}
bootstrap();
