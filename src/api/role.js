import request from '@/utils/request'

export function listMenuByRole(roleId) {
  return request({
    url: '/Role/ListMenuByRole',
    method: 'get',
    params: { roleId }
  })
}

export function allocMenu(data) {
  //debugger;
  return request({
    url: '/Role/AllocMenu',
    method: 'post',
    data
  })
}


export function createRole(data) {
  return request({
    url: '/Role/CreateRole',
    method: 'post',
    data
  })
}

export function updateRole(data) {
  return request({
    url: '/Role/UpdateRole',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/Role/UpdateStatus',
    method: 'post',
    data
  })
}

export function deleteRole(data) {
  return request({
    url: '/Role/List',
    method: 'post',
    data
  })
}

export function fetchList(params) {
  return request({
    url: '/Role/FetchList',
    method: 'get',
    params: params
  })
}

export function getAllRoleList() {
  return request({
    url: '/Role/GetAllRoleList',
    method: 'get'
  })
}
