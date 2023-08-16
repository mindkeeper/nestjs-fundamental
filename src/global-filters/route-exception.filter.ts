import { Catch, HttpStatus, NotFoundException } from '@nestjs/common';
import { ExceptionFilter, ArgumentsHost } from '@nestjs/common';
import { Response, Request } from 'express';

@Catch(NotFoundException)
export class RouteNotFoundFilter implements ExceptionFilter {
  catch(exception: NotFoundException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    response.status(404).json({
      statusCode: HttpStatus.NOT_FOUND,
      message: `cannot find ${request.url} in this server`,
      timettamp: new Date().toString(),
    });
  }
}
