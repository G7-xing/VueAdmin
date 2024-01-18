import request from '@/utils/request'


export function createCTReport(data) {
  return request({
    url: '/CTReport/CreateCTReport',
    method: 'post',
    data
  })
}

export function updateCTReport(data) {
  return request({
    url: '/CTReport/UpdateCTReport',
    method: 'post',
    data
  })
}

export function updateStatus(data) {
  return request({
    url: '/CTReport/UpdateStatus',
    method: 'post',
    data
  })
}

export function deleteCTReport(CTReportId) {
  return request({
    url: '/CTReport/deleteCTReport',
    method: 'get',
    params:{CTReportId}
  })
}

export function fetchList(data) {
  return request({
    url: '/CTReport/FetchList',
    method: 'post',
    data
  })
}

export function fetchAllList() {
  return request({
    url: '/CTReport/FetchAllList',
    method: 'get'
  })
}

export function saveDetailData(data) {
  return request({
    url: '/CTReport/saveDetailData',
    method: 'post',
    data
  })
}

export function eyeDetailData(CTReportId) {
  return request({
    url: '/CTReport/eyeDetailData',
    method: 'get',
    params:{CTReportId}
  })
}


