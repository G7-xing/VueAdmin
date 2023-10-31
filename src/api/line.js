import request from '@/utils/request'


export function createLine(data) {
  return request({
    url: '/Line/CreateLine',
    method: 'post',
    data
  })
}

export function updateLine(data) {
  return request({
    url: '/Line/UpdateLine',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/Line/UpdateStatus',
    method: 'post',
    data
  })
}

export function deleteLine(data) {
  return request({
    url: '/Line/List',
    method: 'post',
    data
  })
}

export function fetchList(params) {
  return request({
    url: '/Line/FetchList',
    method: 'get',
    params: params
  })
}

export function fetchAllList() {
  return request({
    url: '/Line/FetchAllList',
    method: 'get'
  })
}


