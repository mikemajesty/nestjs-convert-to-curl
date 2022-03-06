"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const converter_1 = require("../converter");
describe('Converter', () => {
    describe('AxiosConvert', () => {
        test('should ', () => __awaiter(void 0, void 0, void 0, function* () {
            const curl = `http://www.dfjndfndfn.com' --header 'Accept: application/json, text/plain, */*' --header 'User-Agent: axios/0.26.0`;
            try {
                yield axios_1.default.get('http://www.dfjndfndfn.com');
            }
            catch (error) {
                const libCurl = converter_1.AxiosConverter.getCurl(error);
                expect(libCurl.includes(curl)).toEqual(true);
            }
        }));
    });
});
