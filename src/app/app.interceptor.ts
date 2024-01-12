import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import * as path from 'path';
import * as fs from 'fs';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, Response> {
  intercept(context: ExecutionContext, next: CallHandler) {
    const request = context.switchToHttp().getRequest();
    const { ip, method, url } = request;

    const response = context.switchToHttp().getResponse();
    const { statusCode } = response;

    fs.appendFile(
      path.join(__dirname, '../../log/log.info'),
      `${ip} ${method} ${url} ${statusCode}\n`,
      (err: Error) => {
        if (err) {
          console.error(err);
        }
        // done!
      },
    );

    return next.handle();
  }
}
