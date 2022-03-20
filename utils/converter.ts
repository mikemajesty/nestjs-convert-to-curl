export class AxiosConverter {
  
  static getCurl(request: any = {}): string {
    if (!request?.config) return 'Axios error is required';
    
    let header = '';
    Object.keys(request?.headers || {}).forEach((r) => (header += `--header '${r}: ${request.headers[String(r)]}' `));

    let params = '';
    Object.keys(request?.params || {}).forEach((p) => (params += `/${p}/${request.params[String(p)]}`));

    const body = `--data-raw '${request?.data}'`;
    const paramsUrl = `${request?.params ? params : ''}`;

    const curl = `curl --location -g --request ${request.method.toUpperCase()}
'${request.url + paramsUrl}' ${header} ${request?.data ? body : ''}`;

    return curl;
  }
}