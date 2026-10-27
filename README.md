# Convert Axios to cURL

A lightweight TypeScript utility to convert Axios requests and errors into cURL commands for debugging and logging purposes.

[![npm version](https://badge.fury.io/js/nestjs-convert-to-curl.svg)](https://www.npmjs.com/package/nestjs-convert-to-curl)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## Installation

```bash
npm install nestjs-convert-to-curl
```

## Features

- 🔄 Convert Axios requests to cURL commands
- 🔒 Opt-in masking of body fields, headers and query parameters
- 🐚 Shell-safe quoting
- 📝 Support for all HTTP methods (GET, POST, PUT, PATCH, DELETE)
- 🎯 Works with Axios errors and request configs
- 🔍 Query parameters and headers support
- 💾 Request body handling (JSON, strings, buffers)

## Usage

### Basic Example

```ts
import axios from 'axios';
import { AxiosConverter } from 'nestjs-convert-to-curl';

try {
  await axios.post('https://api.example.com/users', {
    name: 'John Doe',
    email: 'john@example.com'
  });
} catch (error) {
  console.log(AxiosConverter.getCurl(error));
}
```

**Output:**
```bash
curl --location -g --request POST 'https://api.example.com/users' --header 'Content-Type: application/json' --data-raw '{"name":"John Doe","email":"john@example.com"}'
```

### Masking sensitive data

Nothing is masked by default. Pass the fields, headers and query parameters you
consider sensitive:

```ts
try {
  await axios.post(
    'https://api.example.com/auth?api_key=my-key',
    { username: 'johndoe', password: 'secret123' },
    { headers: { Authorization: 'Bearer token123' } }
  );
} catch (error) {
  console.log(
    AxiosConverter.getCurl(error, {
      body: ['password'],
      headers: ['authorization'],
      query: ['api_key']
    })
  );
}
```

**Output:**
```bash
curl --location -g --request POST 'https://api.example.com/auth?api_key=******' --header 'Authorization: ******' --data-raw '{"username":"johndoe","password":"******"}'
```

- `body`: JSON fields, with dot notation for nested ones (`credentials.ssn`).
- `headers`: header names, case-insensitive.
- `query`: keys from the URL query string and from `params`, case-insensitive.

The array form from previous versions still works and masks body fields only:

```ts
AxiosConverter.getCurl(error, ['password', 'credentials.ssn']);
```

A password in the URL (`https://user:password@host`) is always masked, since
it is never useful in a debug command.

### Shell-safe output

Every value is single-quoted with POSIX escaping, so values containing `'`
(e.g. `O'Brien`) produce a valid command and cannot break out of the quotes
when the command is pasted into a terminal.

### Using with Axios Config

You can also pass an Axios config object directly:

```ts
import { AxiosConverter } from 'nestjs-convert-to-curl';

const config = {
  method: 'GET',
  url: 'https://api.example.com/users',
  params: { page: 1, limit: 10 },
  headers: { Accept: 'application/json' }
};

console.log(AxiosConverter.getCurl(config));
```

**Output:**
```bash
curl --location -g --request GET 'https://api.example.com/users?page=1&limit=10' --header 'Accept: application/json'
```

## API Reference

### `AxiosConverter.getCurl(request, anonymize?)`

Converts an Axios request or error to a cURL command.

**Parameters:**
- `request` (required): Axios error object or request config
- `anonymize` (optional): `AnonymizeOptions` (`{ body?, headers?, query? }`), or an array of body fields (legacy form)

**Returns:** String containing the formatted cURL command

## Use Cases

- 🐛 **Debugging**: Quickly reproduce API calls using cURL
- 📊 **Logging**: Log failed requests in a readable format
- 🔍 **Monitoring**: Track API calls for troubleshooting
- 📝 **Documentation**: Generate cURL examples from your code
- 🧪 **Testing**: Share reproducible API calls with your team

## Contributing

Contributions are welcome! Feel free to submit issues and pull requests.

## Contributors

[<img alt="mikemajesty" src="https://avatars1.githubusercontent.com/u/11630212?s=460&v=4&s=117" width="117">](https://github.com/mikemajesty)

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).
