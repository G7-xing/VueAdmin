import request from '@/utils/request'


export function createEWIFile(data) {
  return request({
    url: '/EWIFile/CreateEWIFile',
    method: 'post',
    data
  })
}

export function updateEWIFile(data) {
  return request({
    url: '/EWIFile/UpdateEWIFile',
    method: 'post',
    data
  })
}

export function updateStatus(fileId) {
  return request({
    url: '/EWIFile/UpdateStatus',
    method: 'post',
    params: { fileId }
  })
}

export function deleteEWIFile(fileId) {
  return request({
    url: '/EWIFile/DeleteEWIFile',
    method: 'get',
    params: { fileId }
  })
}

export function fetchList(params) {
  return request({
    url: '/EWIFile/FetchList',
    method: 'get',
    params: params
  })
}

export function fetchAllList() {
  return request({
    url: '/EWIFile/FetchAllList',
    method: 'get'
  })
}

export function getFileData(fileId) {
  return request({
    url: '/EWIFile/ViewFile',
    method: 'post',
    params: { fileId },
    responseType: "blob",
    headers: {
      "Content-Type": "application/pdf;charset=utf-8",
    }
  })
}

export function getFileListByLineId(lineId) {
  return request({
    url: '/EWIFile/GetFileListByLineId',
    method: 'get',
    params: { lineId }
  })
}

