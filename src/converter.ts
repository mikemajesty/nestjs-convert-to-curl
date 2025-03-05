import { CallHandler, ExecutionContext, Injectable, Logger, NestInterceptor } from '@nestjs/common';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';

export class AxiosConverter {

  static getCurl(request: any = {}, anonymizedFields: string[] = []): string {
    if (!request?.config) return 'Axios response is required';

    request = request.config

    let header = '';
    Object.keys(request?.headers || {}).forEach((r) => (header += `--header '${r}: ${request.headers[String(r)]}' `));

    let params = '';
    Object.keys(request?.params || {}).forEach((p) => (params += `/${p}/${request.params[String(p)]}`));

    const hasQueryParams = new RegExp('\\?.*').exec(request.url) || [];

    let query = ''
    if (hasQueryParams.length) {
      query = hasQueryParams[0] as string
      request.url = request.url.substring(0, request.url.lastIndexOf('?'))
    }

    const body = getBody(anonymizedFields, `--data-raw '${request?.data}'`);

    const paramsUrl = `${request?.params ? params : ''}`;

    const curl = `curl --location -g --request ${request.method.toUpperCase()} '${request.url + paramsUrl + query}' ${header} ${request?.data ? body : ''}`;

    return curl.trim().replace(/\\"/g, "\"");
  }
}

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

const getBody = (anonymizedFields: string[], body: string) => {
  if (!anonymizedFields.length) {
    return body
  }

  for (const field of anonymizedFields) {
    const regexField = `("${field}":)"(.*?)"`;
    const regex = new RegExp(`${regexField}`);

    const exec = regex.exec(body);

    if (exec?.length === 3) {
      body = body.replace(exec[2], "******");
    }
  }

  return body
}
