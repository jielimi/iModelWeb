import axios from 'axios';
import router from "../router/index";


axios.defaults.timeout = 10000000;
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

axios.interceptors.response.use(
  response => {
    switch(response.data.state){
      case 401:
          router.replace({
              path: 'login',
              query: {redirect: router.currentRoute.fullPath}
          })
          break;
          default:
              return response;
      }
  },
  error => {
      if (error.response) {
          switch (error.response.status) {
              case 401:
                  router.replace({
                      path: 'login',
                      query: {redirect: router.currentRoute.fullPath}
                  })
          }
      }
      return Promise.reject(error.response.data)   // 返回接口返回的错误信息
  });
/**
 * 封装get方法
 * @param url
 * @param data
 * @returns {Promise}
 */

export function get(url, params = {}, headers = {}) {
  return new Promise((resolve, reject) => {
    axios.get(url, {
      params: params,
      headers:headers
    })
    .then(response => {
      if(response && response.data != undefined){
        resolve(response.data);
      }
      resolve(
        {
          state:401
        }
      )
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
        console.log('catch',err)
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
    axios.delete(url, {'data': data})
      .then(response => {
        resolve(response.data);
      }, err => {
        reject(err)
      })
  })
}
