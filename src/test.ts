import { PromiseLock } from './index'
import axios, { AxiosResponse, AxiosRequestConfig } from 'axios'

const newFetch = new PromiseLock<AxiosRequestConfig, AxiosResponse>(axios);
const axiosConfig = {
  method: "GET",
  url: 'http://myip.ipip.net'
} as AxiosRequestConfig;

newFetch.setIntercaption('pre_position', (res: any) => {
  console.info('interceptor: ', res);
  return res
})

newFetch.start({ ...axiosConfig, data: 'first' }).then(function (response: any) {
  console.info('newFetch lock status: ', newFetch.getLockStatus());
  console.info('first: ', response.data)
}).catch(err => console.log('first error:', err))


newFetch.start({ ...axiosConfig, data: 'scond' }).then(function (response: any) {
  console.info('second: ', response.data)
  newFetch.unlock()
}).catch(err => console.log('second error:', err))

newFetch.lock()

newFetch.start({ ...axiosConfig, data: 'thred' }).then(function (response) {
  console.info('thired: ', response.data)
}).catch(err => console.log('thired error:', err))


newFetch.start({ ...axiosConfig, data: 'four' }).then(function (response: any) {
  console.info('newFetch lock status: ', newFetch.getLockStatus());
  console.info('four: ', response.data)
}).catch(err => console.log('four error:', err))
