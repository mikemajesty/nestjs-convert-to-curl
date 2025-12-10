// src/converter.ts
export class AxiosConverter {
  /**
   * Converte uma configuração do Axios em um comando curl
   * @param request Configuração do Axios ou objeto com .config
   * @param anonymizedFields Campos sensíveis para anonimizar
   * @returns Comando curl formatado
   */
  static getCurl(request: any = {}, anonymizedFields: string[] = []): string {
    // Extrai a configuração do Axios (suporta tanto axios puro quanto @nestjs/axios)
    const axiosConfig = request?.config || request;
    
    if (!axiosConfig) {
      return 'Axios config is required';
    }

    const { method = 'GET', url = '', headers = {}, params = {}, data } = axiosConfig;

    // 1. Headers
    let header = '';
    Object.keys(headers || {}).forEach((key) => {
      const value = headers[String(key)];
      if (value !== undefined && !['common', 'delete', 'get', 'head', 'post', 'put', 'patch'].includes(key)) {
        header += `--header '${key}: ${value}' `;
      }
    });

    // 2. URL com query params
    let fullUrl = url || '';
    
    // Adiciona params como query string
    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });
      
      const queryString = queryParams.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes('?') ? '&' : '?') + queryString;
      }
    }

    // 3. Body (apenas para POST, PUT, PATCH)
    let body = '';
    const methodUpper = (method || 'GET').toUpperCase();
    
    if (data && ['POST', 'PUT', 'PATCH'].includes(methodUpper)) {
      let bodyString: string;
      
      if (typeof data === 'string') {
        bodyString = data;
      } else if (Buffer.isBuffer(data)) {
        bodyString = '[Buffer]';
      } else {
        bodyString = JSON.stringify(data);
      }

      // Anonimiza campos sensíveis
      if (anonymizedFields.length > 0) {
        bodyString = this.anonymizeBody(bodyString, anonymizedFields);
      }

      body = `--data-raw '${bodyString}'`;
    }

    // 4. Monta o comando curl
    const curl = `curl --location -g --request ${methodUpper} '${fullUrl}' ${header.trim()} ${body}`;
    
    return curl.trim().replace(/\s+/g, ' ').replace(/\\"/g, '"');
  }

  /**
   * Anonimiza campos sensíveis no body da requisição
   * @param bodyString String do body (JSON ou texto)
   * @param anonymizedFields Campos para anonimizar
   * @returns Body com campos anonimizados
   */
  private static anonymizeBody(bodyString: string, anonymizedFields: string[]): string {
    try {
      const parsed = JSON.parse(bodyString);
      
      anonymizedFields.forEach(field => {
        // Busca simples (ex: "password": "123")
        if (parsed[field] !== undefined) {
          parsed[field] = '******';
        }
        
        if (field.includes('.')) {
          const parts = field.split('.');
          let current: any = parsed;
          
          for (let i = 0; i < parts.length - 1; i++) {
            if (current && typeof current === 'object' && current[parts[i]]) {
              current = current[parts[i]];
            } else {
              current = null;
              break;
            }
          }
          
          if (current && current[parts[parts.length - 1]] !== undefined) {
            current[parts[parts.length - 1]] = '******';
          }
        }
      });
      
      return JSON.stringify(parsed);
    } catch {
      // Se não for JSON válido, usa regex
      let anonymized = bodyString;
      
      anonymizedFields.forEach(field => {
        // Procura por padrões como: "field": "value"
        const regex = new RegExp(`("${field}"\\s*:\\s*)"([^"]*)"`, 'gi');
        anonymized = anonymized.replace(regex, `$1"******"`);
      });
      
      return anonymized;
    }
  }
}