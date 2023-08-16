import {
  Catch,
  ExceptionFilter,
  Logger,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
type ResponseBody = {
  message: string;
  timestamp: string;
  statusCode: number;
};
@Catch()
export class AllExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(AllExceptionFilter.name);
  constructor(private httpAdapterHost: HttpAdapterHost) {}
  catch(exception: any, host: ArgumentsHost) {
    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();
    const status = HttpStatus.INTERNAL_SERVER_ERROR;

    this.logger.error(`Exception: ${exception.message}, status:${status}`);

    const responseBody: ResponseBody = {
      message: 'Internal Server Error',
      timestamp: new Date().toString(),
      statusCode: status,
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
