import request from '@/utils/request'


export function createAttendance(data) {
  return request({
    url: '/Attendance/CreateAttendance',
    method: 'post',
    data
  })
}

export function updateAttendance(data) {
  return request({
    url: '/Attendance/UpdateAttendance',
    method: 'post',
    data
  })
}


export function deleteAttendance(params) {
  return request({
    url: '/Attendance/DeleteAttendance',
    method: 'get',
    params
  })
}

export function fetchList(data) {
  //debugger
  return request({
    url: '/Attendance/FetchList',
    method: 'post',
    data
  })
}



