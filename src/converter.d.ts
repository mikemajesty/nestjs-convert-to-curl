// src/index.d.ts
declare module "nestjs-convert-to-curl" {
  export const MASK = "******";

  /**
   * What to mask in the generated cURL. Nothing is masked unless listed.
   */
  export type AnonymizeOptions = {
    /** JSON body fields, with dot notation for nested ones. */
    body?: string[];
    /** Header names, case-insensitive. */
    headers?: string[];
    /** Query string / `params` keys, case-insensitive. */
    query?: string[];
  };

  export class AxiosConverter {
    /**
     * Converts an Axios config (or an Axios error, through its `.config`) into a cURL command.
     * @param request Axios config or an object with `.config`
     * @param anonymize Body fields to mask (legacy array form) or `AnonymizeOptions`
     */
    static getCurl(
      request?: any,
      anonymize?: string[] | AnonymizeOptions,
    ): string;
  }
}
