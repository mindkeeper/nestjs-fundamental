import {
  Catch,
  HttpException,
  Logger,
  ArgumentsHost,
  ExceptionFilter,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma } from '@prisma/client';
import { Response } from 'express';

@Catch(HttpException, Prisma.PrismaClientKnownRequestError)
export class HttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(HttpExceptionFilter.name);

  constructor(private configService: ConfigService) {}
  catch(
    exception: HttpException | Prisma.PrismaClientKnownRequestError,
    host: ArgumentsHost,
  ) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    let status: number;
    let message: string;
    const isProd = this.configService.get('NODE_ENV') === 'production';
    if (exception instanceof HttpException) {
      status = exception.getStatus();
      message = exception.message;
    }
    if (exception instanceof Prisma.PrismaClientKnownRequestError) {
      console.log('prisma if runned');
      switch (exception.code) {
        case 'P2002':
          status = 409;
          message = `${exception.meta?.target[0]} already exist`;
          break;
        default:
          break;
      }
    }
    this.logger.error(`Exception: ${exception.message}, status:${status}`);

    response.status(status).json(
      isProd
        ? {
            statusCode: status,
            timestamp: new Date().toString(),
            message,
            data: {},
          }
        : {
            statusCode: status,
            timestamp: new Date().toString(),
            message,
            stackTrace: exception.stack,
            data: {},
          },
    );
  }
}
