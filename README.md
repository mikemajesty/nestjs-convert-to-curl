# Covert Axios error to curl

```bash
$ npm i nestjs-convert-to-curl
```

## Usage

```ts
import Axios from 'Axios';
import { AxiosConverter } from 'nestjs-convert-to-curl';

async getHealth(): Promise<string> {
    try {
      return await Axios.post('https://url', {
        foo: 'bar',
      });
    } catch (error) {
      console.log(AxiosConverter.getCurl(error));
    }
  }
```

```
curl --location -g --request POST
    'https://url' --header 'Accept: application/json, text/plain, */*' --header 'Content-Type: application/json' --header 'User-Agent: axios/0.24.0' --header 'Content-Length: 13'  --data-raw '{"foo":"bar"}'
```


---

The following is a list of all the people that have contributed to nestjs-convert-to-curl. Thanks for your contributions!

[<img alt="mikemajesty" src="https://avatars1.githubusercontent.com/u/11630212?s=460&v=4&s=117" width="117">](https://github.com/mikemajesty)

## License

It is available under the MIT license.
[License](https://opensource.org/licenses/mit-license.php)
