import axios from 'axios';
import router from "../router/index";
import { setCookie,getCookie } from '@/utils/cookies';


axios.defaults.timeout = 10000000;
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';
let isRefreshing = false;
let requests = []


function backToLogin(){
  router.replace({
    path: 'login',
    query: {redirect: router.currentRoute.fullPath}
  })
}
function refresh(){
  return axios.post('api/user/refreshtoken').then(res => res.data)
}


axios.interceptors.response.use(
  response => {
    switch(response.data.state){
      case 401:{
        backToLogin()
        break;
      }
      case 10001:{ 
        const refreshToken = getCookie('refreshToken');
        if(!refreshToken){
          backToLogin();
          break;
        }

        if (!isRefreshing) {
          isRefreshing = true;
          return refresh().then(res => {
            setCookie('token',res.data.token,3600*2);
            const config = response.config;
            requests.forEach(cb=>cb());
            requests = [];
            return axios(config)
          }).catch(res => {
            backToLogin();
          }).finally(() => {
            isRefreshing = false
          })
        }else{
          return new Promise((resolve) => {
            requests.push(() => {
              resolve(instance(response.config))
            })
          })
        }
      }
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
