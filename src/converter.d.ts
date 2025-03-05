import { CallHandler, ExecutionContext } from "@nestjs/common";
import { Observable } from "rxjs";

declare module "nestjs-convert-to-curl" {
  export class AxiosConverter {
    static getCurl(request: any, anonymizedFields: string[]): string
  }

  export class LogAxiosErrorInterceptor {
    intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown>
  }
} 