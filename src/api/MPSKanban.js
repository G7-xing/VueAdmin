import request from '@/utils/request'


// export function createAttendance(data) {
//   return request({
//     url: '/Attendance/CreateAttendance',
//     method: 'post',
//     data
//   })
// }

// export function updateAttendance(data) {
//   return request({
//     url: '/Attendance/UpdateAttendance',
//     method: 'post',
//     data
//   })
// }


export function getDeatils() {
  return request({
    url: '/MPSKanban/getDeatils',
    method: 'get',
  })
}

// export function fetchList(data) {
//   //debugger
//   return request({
//     url: '/Attendance/FetchList',
//     method: 'post',
//     data
//   })
// }



