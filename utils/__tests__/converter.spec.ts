import Axios from 'axios';
import { AxiosConverter } from '../converter';

describe('Converter', () => {
  describe('AxiosConvert GET', () => {
    test('should get successfully', async () => {
      const curl = `curl --location -g --request GET 'http://www.___.com' --header 'Accept: application/json, text/plain, */*' --header 'User-Agent: axios/0.26.0'`
      
      try {
        await Axios.get('http://www.___.com')
      } catch (error) {
        const libCurl = AxiosConverter.getCurl(error);
        console.log(libCurl);
        expect(curl).toEqual(libCurl)
      }
    });

    test('should get successfully with query string', async () => {
      const curl = `curl --location -g --request GET 'http://www.___.com?foo=bar' --header 'Accept: application/json, text/plain, */*' --header 'User-Agent: axios/0.26.0'`
      
      try {
        await Axios.get('http://www.___.com?foo=bar')
      } catch (error) {
        const libCurl = AxiosConverter.getCurl(error);
        console.log(libCurl);
        expect(curl).toEqual(libCurl)
      }
    });

    test('should get successfully with query params', async () => {
      const curl = `curl --location -g --request GET 'http://www.___.com/foo/bar' --header 'Accept: application/json, text/plain, */*' --header 'User-Agent: axios/0.26.0'`
      
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
      const curl = `curl --location -g --request POST 'http://www.___.com/foo/bar?teste=1' --header 'Accept: application/json, text/plain, */*' --header 'Content-Type: application/json' --header 'Authorization: Bearer token' --header 'User-Agent: axios/0.26.0' --header 'Content-Length: 13'  --data-raw '{"foo":"bar"}'`
      try {
        await Axios.post('http://www.___.com?teste=1', { foo: 'bar' }, { params: { foo: 'bar' }, headers: { Authorization: 'Bearer token' } })
      } catch (error) {
        const libCurl = AxiosConverter.getCurl(error);
        console.log(libCurl);
        expect(curl).toEqual(libCurl)
      }
    });
  });
});