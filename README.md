# Covert Axios error to curl

```bash
$ npm i nestjs-convert-to-curl
```

## Usage

<!-- Global -->

```ts
// main.ts
// if your prefer to use in a global application

import { LogAxiosErrorInterceptor } from 'nestjs-convert-to-curl';

async function bootstrap() {
   .....
   app.useGlobalInterceptors(new LogAxiosErrorInterceptor());
}

```

```bash
curl --location -g --request POST 'http://url' --header 'Accept: application/json, text/plain, */*' --header 'Content-Type: application/json' --header 'User-Agent: axios/0.26.0' --header 'Content-Length: 13'  --data-raw '{"foo":"bar"}'
```

---

<!-- method -->

```ts
// service.ts
// If you prefer to use in a service.

import { AxiosConverter } from "nestjs-convert-to-curl";

try {
  return await Axios.post(
    "http://www.mymockservice.com",
    {
      foo: "bar",
      password: "123mudar",
      employee: { name: "Mike", cpf: "41288055800" },
    },
    { headers: { Authorization: "Bearer token" } }
  );
} catch (error) {
  console.log(AxiosConverter.getCurl(error));
}
```

```bash
curl --location -g --request POST 'http://www.mymockservice.com' --header 'Accept: application/json, text/plain, */*' --header 'Content-Type: application/json' --header 'Authorization: Bearer token' --header 'User-Agent: axios/1.6.7' --header 'Content-Length: 82' --header 'Accept-Encoding: gzip, compress, deflate, br'  --data-raw '{"foo":"bar","password":"******","employee":{"name":"Mike","cpf":"******"}}'
```

---

The following is a list of all the people that have contributed to nestjs-convert-to-curl. Thanks for your contributions!

[<img alt="mikemajesty" src="https://avatars1.githubusercontent.com/u/11630212?s=460&v=4&s=117" width="117">](https://github.com/mikemajesty)

## License

It is available under the MIT license.
[License](https://opensource.org/licenses/mit-license.php)
