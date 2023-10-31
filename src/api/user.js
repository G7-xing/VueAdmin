import request from '@/utils/request'

export function login(data) {
  return request({
    url: '/Login/Login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/Login/Info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/Login/LoginOut',
    method: 'post'
  })
}

export function getUserList(params) {
  return request({
    url: '/User/List',
    method: 'get',
    params: params
  })
}

export function createUser(data) {
  return request({
    url: '/User/CreateUser',
    method: 'post',
    data
  })
}

export function updateUser(data) {
  return request({
    url: '/User/updateUser',
    method: 'post',
    data
  })
}
export function updateStatus(data) {
  return request({
    url: '/User/updateStatus',
    method: 'post',
    params:{userid}
  })
}
export function deleteUser(userid) {
  return request({
    url: '/User/DeleteUser',
    method: 'post',
    params:{userid}
  })
}

export function allocRole(data) {
  return request({
    url: '/User/AllocRole',
    method: 'post',
    data
  })
}

export function getRoleByUser(userid) {
  return request({
    url: '/User/GetRoleByUser',
    method: 'get',
    params:{userid}
  })
}