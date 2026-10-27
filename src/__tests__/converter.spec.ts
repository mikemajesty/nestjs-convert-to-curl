import { execFileSync } from "child_process";

import { AxiosHeaders } from "axios";

import { AxiosConverter, MASK } from "../converter";

// Runs the generated command with `curl` replaced by a shell function that prints each argument,
// proving how a real shell would split and interpret it.
const parseWithShell = (curl: string): string[] => {
  const script = `curl() { for arg in "$@"; do printf '%s\\0' "$arg"; done; }; ${curl}`;
  return execFileSync("sh", ["-c", script]).toString().split("\0").slice(0, -1);
};

describe("AxiosConverter", () => {
  describe("GET", () => {
    test("should convert a GET request", () => {
      const curl = AxiosConverter.getCurl({
        method: "get",
        url: "http://www.example.com",
        headers: { Accept: "application/json" },
      });

      expect(curl).toBe(
        "curl --location -g --request GET 'http://www.example.com' --header 'Accept: application/json'",
      );
    });

    test("should append params to the query string", () => {
      const curl = AxiosConverter.getCurl({
        url: "http://www.example.com?foo=bar",
        params: { page: 1, empty: null },
      });

      expect(curl).toBe(
        "curl --location -g --request GET 'http://www.example.com?foo=bar&page=1'",
      );
    });

    test("should read the config from an Axios error", () => {
      const curl = AxiosConverter.getCurl({
        config: { method: "delete", url: "http://www.example.com/1" },
      });

      expect(curl).toBe(
        "curl --location -g --request DELETE 'http://www.example.com/1'",
      );
    });

    test("should support AxiosHeaders and skip axios header groups", () => {
      const headers = new AxiosHeaders({
        "X-Trace": "abc",
      }) as unknown as Record<string, unknown>;
      headers.common = { Accept: "x" };

      const curl = AxiosConverter.getCurl({
        url: "http://www.example.com",
        headers,
      });

      expect(curl).toBe(
        "curl --location -g --request GET 'http://www.example.com' --header 'X-Trace: abc'",
      );
    });
  });

  describe("body", () => {
    const request = {
      method: "post",
      url: "http://www.example.com",
      headers: { "Content-Type": "application/json" },
      data: {
        foo: "bar",
        password: "123mudar",
        employee: { name: "Mike", cpf: "41288055800" },
      },
    };

    test("should keep the legacy array form masking body fields only", () => {
      const curl = AxiosConverter.getCurl(request, [
        "password",
        "employee.cpf",
      ]);

      expect(curl).toBe(
        `curl --location -g --request POST 'http://www.example.com' --header 'Content-Type: application/json' --data-raw '{"foo":"bar","password":"${MASK}","employee":{"name":"Mike","cpf":"${MASK}"}}'`,
      );
    });

    test("should mask body fields through the options object", () => {
      const curl = AxiosConverter.getCurl(request, { body: ["password"] });

      expect(curl).toContain(`"password":"${MASK}"`);
      expect(curl).toContain('"cpf":"41288055800"');
    });

    test("should mask fields of a non-JSON string body", () => {
      const curl = AxiosConverter.getCurl(
        { ...request, data: '{"password": "123", broken' },
        ["password"],
      );

      expect(curl).toContain(`"password": "${MASK}"`);
    });

    test("should not send a body for methods without one", () => {
      const curl = AxiosConverter.getCurl({ ...request, method: "get" });

      expect(curl).not.toContain("--data-raw");
    });

    test("should represent a Buffer body as a placeholder", () => {
      const curl = AxiosConverter.getCurl({
        ...request,
        data: Buffer.from("binary"),
      });

      expect(curl).toContain("--data-raw '[Buffer]'");
    });
  });

  describe("headers", () => {
    const request = {
      url: "http://www.example.com",
      headers: {
        Authorization: "Bearer secret",
        Cookie: "session=secret",
        "X-Request-Id": "visible",
      },
    };

    test("should not mask headers by default", () => {
      const curl = AxiosConverter.getCurl(request);

      expect(curl).toContain("--header 'Authorization: Bearer secret'");
    });

    test("should mask listed headers case-insensitively and keep the others", () => {
      const curl = AxiosConverter.getCurl(request, {
        headers: ["authorization", "COOKIE"],
      });

      expect(curl).toContain(`--header 'Authorization: ${MASK}'`);
      expect(curl).toContain(`--header 'Cookie: ${MASK}'`);
      expect(curl).toContain("--header 'X-Request-Id: visible'");
      expect(curl).not.toContain("secret");
    });
  });

  describe("query", () => {
    test("should not mask query parameters by default", () => {
      const curl = AxiosConverter.getCurl({
        url: "http://www.example.com?api_key=secret",
      });

      expect(curl).toContain("api_key=secret");
    });

    test("should mask listed keys from the URL and from params, keeping the rest untouched", () => {
      const curl = AxiosConverter.getCurl(
        {
          url: "http://www.example.com/a%20b?API_KEY=secret&page=1#top",
          params: { access_token: "secret", q: "a b" },
        },
        { query: ["api_key", "access_token"] },
      );

      expect(curl).toBe(
        `curl --location -g --request GET 'http://www.example.com/a%20b?API_KEY=${MASK}&page=1&access_token=${MASK}&q=a+b#top'`,
      );
    });

    test("should match encoded keys", () => {
      const curl = AxiosConverter.getCurl(
        { url: "http://www.example.com?api%5Fkey=secret" },
        { query: ["api_key"] },
      );

      expect(curl).toContain(`api%5Fkey=${MASK}`);
    });
  });

  describe("URL credentials", () => {
    test("should always mask the password in the URL", () => {
      const curl = AxiosConverter.getCurl({
        url: "https://user:p%40ss@www.example.com/path?x=1",
      });

      expect(curl).toContain(`'https://user:${MASK}@www.example.com/path?x=1'`);
    });

    test("should keep a URL without credentials untouched", () => {
      const curl = AxiosConverter.getCurl({
        url: "https://www.example.com/users/me@home",
      });

      expect(curl).toContain("'https://www.example.com/users/me@home'");
    });
  });

  describe("shell safety", () => {
    test("should escape single quotes so the shell receives the exact values", () => {
      const data = {
        name: "O'Brien",
        note: 'it\'s "quoted"  with  spaces\nand a newline',
      };

      const args = parseWithShell(
        AxiosConverter.getCurl({
          method: "post",
          url: "http://www.example.com?q=it's",
          headers: { "X-Name": "O'Brien" },
          data,
        }),
      );

      expect(args).toEqual([
        "--location",
        "-g",
        "--request",
        "POST",
        "http://www.example.com?q=it's",
        "--header",
        "X-Name: O'Brien",
        "--data-raw",
        JSON.stringify(data),
      ]);
    });

    test("should not let a value break out of the quotes and run commands", () => {
      const injection = "'; echo INJECTED; '";

      const args = parseWithShell(
        AxiosConverter.getCurl({
          method: "post",
          url: "http://www.example.com",
          data: injection,
        }),
      );

      expect(args).toContain(injection);
      expect(args).not.toContain("INJECTED");
    });
  });
});
