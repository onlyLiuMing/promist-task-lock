"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const index_1 = require("./index");
const axios_1 = __importDefault(require("axios"));
const newFetch = new index_1.PromiseLock(axios_1.default);
const axiosConfig = {
    method: "GET",
    url: 'http://myip.ipip.net'
};
newFetch.setIntercaption('pre_position', (res) => {
    console.info('interceptor: ', res);
    return res;
});
newFetch.start({ ...axiosConfig, data: 'first' }).then(function (response) {
    console.info('first: ', response.data);
}).catch(err => console.log('first error:', err));
newFetch.start({ ...axiosConfig, data: 'scond' }).then(function (response) {
    console.info('second: ', response.data);
    newFetch.unlock();
}).catch(err => console.log('second error:', err));
newFetch.lock();
newFetch.start({ ...axiosConfig, data: 'thred' }).then(function (response) {
    console.info('thired: ', response.data);
}).catch(err => console.log('thired error:', err));
newFetch.start({ ...axiosConfig, data: 'four' }).then(function (response) {
    console.info('four: ', response.data);
}).catch(err => console.log('four error:', err));
