import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';

@Catch()
export class HttpErrorFilter implements ExceptionFilter {

  catch(exception: any, host: ArgumentsHost): any {
    let errorResponse;
    const ctx = host.switchToHttp();
    const request = ctx.getRequest();
    const response = ctx.getResponse();
    if (exception instanceof HttpException) {
      const status = exception.getStatus() || HttpStatus.INTERNAL_SERVER_ERROR;
      let badRequestMessage;
      if (status === HttpStatus.BAD_REQUEST) {
        badRequestMessage = exception.getResponse()
      }
      errorResponse = {
        code: status,
        timestamp: new Date().toLocaleDateString(),
        path: request.url,
        method: request.method,
        message: badRequestMessage || exception.message || null,
      };
    } else {
      errorResponse = {
        name: exception.name,
        message: exception.message,
      };
    }

    Logger.error(
      `${request.method} ${request.url}`,
      JSON.stringify(errorResponse),
      'ExceptionFilter');

    response.status(404).json(errorResponse);
  }
}
