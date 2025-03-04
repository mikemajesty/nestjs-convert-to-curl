import Axios from 'axios';
import { AxiosConverter } from '../converter';

describe('Converter', () => {
  describe('AxiosConvert GET', () => {
    test('should get successfully', async () => {
      const curl = "curl --location -g --request GET 'http://www.___.com' --header 'Accept: application/json, text/plain, */*' --header 'Content-Type: undefined' --header 'User-Agent: axios/1.8.1' --header 'Accept-Encoding: gzip, compress, deflate, br'"

      try {
        await Axios.get('http://www.___.com')
      } catch (error) {
        const libCurl = AxiosConverter.getCurl(error);
        console.log(libCurl);
        expect(curl).toEqual(libCurl)
      }
    });

    test('should get successfully with query string', async () => {
      const curl = "curl --location -g --request GET 'http://www.___.com?foo=bar' --header 'Accept: application/json, text/plain, */*' --header 'Content-Type: undefined' --header 'User-Agent: axios/1.8.1' --header 'Accept-Encoding: gzip, compress, deflate, br'"

      try {
        await Axios.get('http://www.___.com?foo=bar')
      } catch (error) {
        const libCurl = AxiosConverter.getCurl(error);
        console.log(libCurl);
        expect(curl).toEqual(libCurl)
      }
    });

    test('should get successfully with query params', async () => {
      const curl = "curl --location -g --request GET 'http://www.___.com/foo/bar' --header 'Accept: application/json, text/plain, */*' --header 'Content-Type: undefined' --header 'User-Agent: axios/1.8.1' --header 'Accept-Encoding: gzip, compress, deflate, br'"

      try {
        await Axios.get('http://www.___.com', { params: { foo: 'bar' } })
      } catch (error) {
        const libCurl = AxiosConverter.getCurl(error);
        console.log(libCurl);
        expect(curl).toEqual(libCurl)
      }
    });
  });

  describe('AxiosConvert POST', () => {
    test('should post successfully', async () => {
      const curl = `curl --location -g --request POST 'http://www.mymockservice.com' --header 'Accept: application/json, text/plain, */*' --header 'Content-Type: application/json' --header 'Authorization: Bearer token' --header 'User-Agent: axios/1.8.1' --header 'Content-Length: 82' --header 'Accept-Encoding: gzip, compress, deflate, br'  --data-raw '{"foo":"bar","password":"******","employee":{"name":"Mike","cpf":"******"}}'`
      try {
        await Axios.post('http://www.mymockservice.com', { foo: 'bar', password: "123mudar", employee: { name: "Mike", cpf: "41288055800" } }, { headers: { Authorization: 'Bearer token' } })
      } catch (error) {
        const libCurl = AxiosConverter.getCurl(error, ['password', "cpf"]);
        console.log(libCurl);
        expect(curl).toEqual(libCurl)
      }
    });
  });
});