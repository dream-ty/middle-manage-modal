import request from '@/utils/request'
import axios from '@/utils/axiosMap'
export function login(data) {
  return axios.post({
    url: '/vue-admin-template/user/login',
    data
  })
  // return axios.post('/vue-admin-template/user/login', data)
}

export function getInfo(token) {
  return request({
    url: '/vue-admin-template/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-admin-template/user/logout',
    method: 'post'
  })
}
