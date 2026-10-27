export const MASK = "******";

/**
 * What to mask in the generated cURL. Nothing is masked unless listed.
 * - `body`: JSON fields, with dot notation for nested ones (`employee.cpf`).
 * - `headers`: header names, case-insensitive (`authorization`, `cookie`).
 * - `query`: query string / `params` keys, case-insensitive (`api_key`).
 */
export type AnonymizeOptions = {
  body?: string[];
  headers?: string[];
  query?: string[];
};

const AXIOS_HEADER_GROUPS = [
  "common",
  "delete",
  "get",
  "head",
  "post",
  "put",
  "patch",
];

const METHODS_WITH_BODY = ["POST", "PUT", "PATCH"];

export class AxiosConverter {
  /**
   * Converts an Axios request config (or an Axios error, through its `.config`) into a cURL command.
   * @param request Axios config or an object with `.config`
   * @param anonymize Body fields to mask (legacy array form) or `AnonymizeOptions`
   */
  static getCurl(
    request: any = {},
    anonymize: string[] | AnonymizeOptions = [],
  ): string {
    const axiosConfig = request?.config || request;

    if (!axiosConfig) {
      return "Axios config is required";
    }

    const options = this.normalizeOptions(anonymize);
    const {
      method = "GET",
      url = "",
      headers = {},
      params = {},
      data,
    } = axiosConfig;
    const methodUpper = (method || "GET").toUpperCase();

    const parts = [
      "curl --location -g --request",
      methodUpper,
      this.quote(this.buildUrl(url, params, options.query)),
    ];

    parts.push(...this.buildHeaders(headers, options.headers));

    const body = this.buildBody(data, methodUpper, options.body);
    if (body !== undefined) {
      parts.push("--data-raw", this.quote(body));
    }

    return parts.join(" ");
  }

  private static normalizeOptions(
    anonymize: string[] | AnonymizeOptions,
  ): Required<AnonymizeOptions> {
    if (Array.isArray(anonymize)) {
      return { body: anonymize, headers: [], query: [] };
    }

    return {
      body: anonymize?.body ?? [],
      headers: (anonymize?.headers ?? []).map((name) => name.toLowerCase()),
      query: (anonymize?.query ?? []).map((name) => name.toLowerCase()),
    };
  }

  private static buildHeaders(
    headers: Record<string, unknown>,
    maskedHeaders: string[],
  ): string[] {
    return Object.keys(headers || {})
      .filter(
        (key) =>
          headers[key] !== undefined && !AXIOS_HEADER_GROUPS.includes(key),
      )
      .flatMap((key) => {
        const value = maskedHeaders.includes(key.toLowerCase())
          ? MASK
          : headers[key];
        return ["--header", this.quote(`${key}: ${value}`)];
      });
  }

  private static buildUrl(
    url: string,
    params: Record<string, unknown>,
    maskedQuery: string[],
  ): string {
    const hashStart = (url || "").indexOf("#");
    const hash = hashStart === -1 ? "" : url.slice(hashStart);
    let fullUrl = hashStart === -1 ? url || "" : url.slice(0, hashStart);

    if (params && Object.keys(params).length > 0) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, String(value));
        }
      });

      const queryString = queryParams.toString();
      if (queryString) {
        fullUrl += (fullUrl.includes("?") ? "&" : "?") + queryString;
      }
    }

    return this.maskQuery(this.maskUrlPassword(fullUrl), maskedQuery) + hash;
  }

  // A password in the URL is never useful in a debug cURL, so it is always masked.
  private static maskUrlPassword(url: string): string {
    return url.replace(
      /^([a-z][a-z0-9+.-]*:\/\/[^/?#@:]*):[^/?#@]*@/i,
      `$1:${MASK}@`,
    );
  }

  // String-based on purpose: rebuilding through `URL` would re-encode the rest of the URL.
  private static maskQuery(url: string, maskedQuery: string[]): string {
    if (!maskedQuery.length) return url;

    const queryStart = url.indexOf("?");
    if (queryStart === -1) return url;

    const query = url
      .slice(queryStart + 1)
      .split("&")
      .map((pair) => {
        const [rawKey] = pair.split("=");
        return maskedQuery.includes(this.decode(rawKey).toLowerCase())
          ? `${rawKey}=${MASK}`
          : pair;
      })
      .join("&");

    return `${url.slice(0, queryStart + 1)}${query}`;
  }

  private static buildBody(
    data: unknown,
    method: string,
    maskedFields: string[],
  ): string | undefined {
    if (!data || !METHODS_WITH_BODY.includes(method)) return undefined;

    if (Buffer.isBuffer(data)) return "[Buffer]";

    const bodyString = typeof data === "string" ? data : JSON.stringify(data);

    return maskedFields.length > 0
      ? this.anonymizeBody(bodyString, maskedFields)
      : bodyString;
  }

  private static anonymizeBody(
    bodyString: string,
    anonymizedFields: string[],
  ): string {
    try {
      const parsed = JSON.parse(bodyString);

      anonymizedFields.forEach((field) => {
        if (parsed[field] !== undefined) {
          parsed[field] = MASK;
        }

        if (field.includes(".")) {
          const parts = field.split(".");
          let current: any = parsed;

          for (let i = 0; i < parts.length - 1; i++) {
            if (current && typeof current === "object" && current[parts[i]]) {
              current = current[parts[i]];
            } else {
              current = null;
              break;
            }
          }

          if (current && current[parts[parts.length - 1]] !== undefined) {
            current[parts[parts.length - 1]] = MASK;
          }
        }
      });

      return JSON.stringify(parsed);
    } catch {
      let anonymized = bodyString;

      anonymizedFields.forEach((field) => {
        const regex = new RegExp(`("${field}"\\s*:\\s*)"([^"]*)"`, "gi");
        anonymized = anonymized.replace(regex, `$1"${MASK}"`);
      });

      return anonymized;
    }
  }

  // POSIX single-quote escaping: the only character that ends a single-quoted string is `'`.
  private static quote(value: string): string {
    return `'${value.replace(/'/g, `'\\''`)}'`;
  }

  private static decode(value: string): string {
    try {
      return decodeURIComponent(value.replace(/\+/g, " "));
    } catch {
      return value;
    }
  }
}
