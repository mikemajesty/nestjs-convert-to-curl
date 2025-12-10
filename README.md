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
- 🔒 Anonymize sensitive fields (passwords, tokens, etc.)
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

### Anonymizing Sensitive Fields

Protect sensitive data by anonymizing specific fields in the request body:

```ts
import axios from 'axios';
import { AxiosConverter } from 'nestjs-convert-to-curl';

try {
  await axios.post('https://api.example.com/auth', {
    username: 'johndoe',
    password: 'secret123',
    apiKey: 'my-secret-key'
  }, {
    headers: { 
      'Authorization': 'Bearer token123' 
    }
  });
} catch (error) {
  // Anonymize password and apiKey fields
  console.log(AxiosConverter.getCurl(error, ['password', 'apiKey']));
}
```

**Output:**
```bash
curl --location -g --request POST 'https://api.example.com/auth' --header 'Content-Type: application/json' --header 'Authorization: Bearer token123' --data-raw '{"username":"johndoe","password":"******","apiKey":"******"}'
```

### Nested Fields Anonymization

You can anonymize nested fields using dot notation:

```ts
import axios from 'axios';
import { AxiosConverter } from 'nestjs-convert-to-curl';

try {
  await axios.post('https://api.example.com/employees', {
    name: 'Mike',
    credentials: {
      password: '123456',
      ssn: '123-45-6789'
    }
  });
} catch (error) {
  console.log(AxiosConverter.getCurl(error, ['credentials.password', 'credentials.ssn']));
}
```

**Output:**
```bash
curl --location -g --request POST 'https://api.example.com/employees' --header 'Content-Type: application/json' --data-raw '{"name":"Mike","credentials":{"password":"******","ssn":"******"}}'
```

### Using with Axios Config

You can also pass an Axios config object directly:

```ts
import { AxiosConverter } from 'nestjs-convert-to-curl';

const config = {
  method: 'GET',
  url: 'https://api.example.com/users',
  params: { page: 1, limit: 10 },
  headers: { 'Authorization': 'Bearer token' }
};

console.log(AxiosConverter.getCurl(config));
```

**Output:**
```bash
curl --location -g --request GET 'https://api.example.com/users?page=1&limit=10' --header 'Authorization: Bearer token'
```

## API Reference

### `AxiosConverter.getCurl(request, anonymizedFields?)`

Converts an Axios request or error to a cURL command.

**Parameters:**
- `request` (required): Axios error object or request config
- `anonymizedFields` (optional): Array of field names to anonymize (supports dot notation for nested fields)

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
