import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AxiosConverter } from '../converter';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class LogAxiosErrorInterceptor implements NestInterceptor {

  intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
    return next.handle().pipe(
      catchError((error) => {
        if (!error?.config) throw error;
        
        if (!error?.uuid) {
          error.uuid = uuidv4();
        }
  
        new Logger(error.uuid).warn(AxiosConverter.getCurl(error))
        
        throw error;
      }),
    );
  }
}
