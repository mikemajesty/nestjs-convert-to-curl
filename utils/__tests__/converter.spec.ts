import Axios from 'axios';
import { AxiosConverter } from '../converter';

describe('Converter', () => {
  describe('AxiosConvert', () => {
    test('should ', async () => {
      const curl = `http://www.dfjndfndfn.com' --header 'Accept: application/json, text/plain, */*' --header 'User-Agent: axios/0.26.0`
      try {
        await Axios.get('http://www.dfjndfndfn.com')
      } catch (error) {
        const libCurl = AxiosConverter.getCurl(error);
        expect(libCurl.includes(curl)).toEqual(true)
      }
    });
  });
});