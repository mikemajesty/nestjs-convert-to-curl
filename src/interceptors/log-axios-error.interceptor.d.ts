import { CallHandler, ExecutionContext, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';

declare module "nestjs-convert-to-curl" {
  export namespace Interceptor {
    export class LogAxiosErrorInterceptor implements NestInterceptor {
      intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown>
    }
  }
}