import request from './request'
import { isObject, defaultTo } from 'lodash'
import qs from 'qs'

// // token 是否即将失效（60分钟后）
// function tokenAlmostExpires() {
//   const time = 60 * 60 * 1000;
//   const token = store.getters.token;
//   if (token) {
//     const data = JSON.parse(atob(token.split('.')[1]));
//     return data.exp * 1000 - +new Date() <= time;
//   }
//   return false;
// }
// 重写配置
function overwriteConfig(config) {
  return {
    ...config,
    url: config.url, // 这里可以修改元地址
    data: toData(config.data, config.isFile, config.method),
    params: toParams(config.params),
    headers: {
      'Content-Type': defaultTo(config.isFile, false)
        ? 'multipart/form-data;'
        : 'application/x-www-form-urlencoded'
    },
    responseType: config.responseType,
    method: config.method
  }
}
// 如果是post传输文件的形式就提前转为formData的形式
function toData(data, isFile, method) {
  if (isFile) {
    return data
  }
  if (method === 'post') {
    return qs.stringify(data, { allowDots: true })
  }
  return data
}
function toParams(params) {
  const data = {}
  for (const param in params) {
    if (isObject(params[param])) {
      for (const key in params[param]) {
        data[param + '.' + key] = params[param][key]
      }
    } else {
      data[param] = params[param]
    }
  }
  return data
}
function send(config) {
  // if (tokenAlmostExpires() && !config.withoutToken) {
  //   if (!updating) {
  //     // 确保同时只有一个刷新token请求
  //     updating = true;
  //     const tokenURL = ACCOUNT_URL + '/v1/tokens/refreshToken';
  //     return axios
  //       .post(tokenURL)
  //       .then(res => {
  //         storeToken(res.data.access_token);
  //         updating = false;
  //         eventBus.$emit('token'); // 通知等待token的请求继续
  //         return axios(overwriteConfig(config));
  //       })
  //       .finally(() => {
  //         updating = false;
  //       });
  //   } else {
  //     // 其他请求等待token刷新完毕再继续
  //     return new Promise((resolve, reject) => {
  //       eventBus.$once('token', () => {
  //         axios(overwriteConfig(config))
  //           .then(res => {
  //             resolve(res);
  //           })
  //           .catch(err => {
  //             reject(err);
  //           });
  //       });
  //     });
  //   }
  // }
  return new Promise((resolve, reject) => {
    request(overwriteConfig(config))
      .then(res => {
        resolve(res)
      })
      .catch(res => {
        if (res && res.statusCode && res.statusCode === 500) {
          reject(new Error('server error'))
        }
        reject(res)
      })
  })
}

export default {
  get: config => {
    return send({
      ...config,
      url: config.url,
      params: config.data,
      isMock: config.isMock,
      path: config.path,
      method: 'get'
    })
  },
  post: config => {
    return send({
      ...config,
      url: config.url,
      data: config.data,
      path: config.path,
      isMock: config.isMock,
      isFile: defaultTo(config.isFile, false),
      method: 'post',
      responseType: config.responseType,
      contentType: defaultTo(config.isFile, false)
        ? 'multipart/form-data;'
        : 'application/x-www-form-urlencoded'
    })
  },
  put: config => {
    return send({
      ...config,
      url: config.url,
      data: config.data,
      path: config.path,
      isMock: config.isMock,
      method: 'put',
      contentType: 'application/json'
    })
  },
  patch: config => {
    return send({
      ...config,
      url: config.url,
      data: config.data,
      path: config.path,
      isMock: config.isMock,
      method: 'patch',
      contentType: 'application/json'
    })
  },
  delete: config => {
    return send({
      ...config,
      url: config.url,
      path: config.path,
      isMock: config.isMock,
      method: 'delete',
      contentType: 'application/json'
    })
  }
}

