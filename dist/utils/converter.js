"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AxiosConverter = void 0;
class AxiosConverter {
    static getCurl(request) {
        if (!request)
            return 'Error: Axios error is required';
        let header = '';
        Object.keys((request === null || request === void 0 ? void 0 : request.headers) || {}).forEach((r) => (header += `--header '${r}: ${request.headers[String(r)]}' `));
        let params = '';
        Object.keys((request === null || request === void 0 ? void 0 : request.params) || {}).forEach((p) => (params += `/${p}/${request.params[String(p)]}`));
        const body = `--data-raw '${request === null || request === void 0 ? void 0 : request.data}'`;
        const paramsUrl = `${(request === null || request === void 0 ? void 0 : request.params) ? params : ''}`;
        const curl = `curl --location -g --request ${request.method.toUpperCase()}
    '${request.url + paramsUrl}' ${header} ${(request === null || request === void 0 ? void 0 : request.data) ? body : ''}`;
        return curl;
    }
}
exports.AxiosConverter = AxiosConverter;
