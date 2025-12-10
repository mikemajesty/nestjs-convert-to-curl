// src/index.d.ts
declare module "nestjs-convert-to-curl" {
  /**
   * Converter Axios para comando cURL
   */
  export class AxiosConverter {
    /**
     * Converte uma configuração do Axios em um comando curl
     * @param request Configuração do Axios ou objeto com .config
     * @param anonymizedFields Campos sensíveis para anonimizar
     * @returns Comando curl formatado
     */
    static getCurl(request?: any, anonymizedFields?: string[]): string;
  }
}