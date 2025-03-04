
declare module "nestjs-convert-to-curl" {
  export class AxiosConverter {
    static getCurl(request: any, anonymizedFields: string[]): string
  }
} 