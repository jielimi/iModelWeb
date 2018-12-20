import axios from 'axios';
import router from "../router/index";


axios.defaults.timeout = 50000;
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

// http request 拦截器
const responseHandler = (response) => {
  switch (response.data.errorCode) {
    case 404:
      router.push({ path: '/404' });
      break;
    case 500:
      router.push({ path: '/500' });
      break;
    default:
      return response;
  }
};

// axios.interceptors.request.use(
//   config => {
//     config.data = JSON.stringify(config.data);
//     config.headers = {
//       'Content-Type': 'application/json'
//       // "x-auth-token": sessionStorage.getItem("x-auth-token"),
//     }
//
//     // if(token){
//     //   config.params = {'token':token}
//     // }
//
//     //config.params = {'token':"93bf83cd-faab-40ef-8830-b58a2c6cd59a"}
//     return config;
//   },
//   error => {
//     return Promise.reject(err);
//   }
// );
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params
    })
      .then(response => {
        resolve(response.data);
      })
      .catch(err => {
        reject(err)
      })
  })
}


/**
 * 封装post请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function post(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.post(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装patch请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function patch(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.patch(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}

/**
 * 封装put请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function put(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.put(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}


/**
 * 封装delete请求
 * @param url
 * @param data
 * @returns {Promise}
 */

export function del(url, data = {}) {
  return new Promise((resolve, reject) => {
    axios.delete(url, data)
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}
