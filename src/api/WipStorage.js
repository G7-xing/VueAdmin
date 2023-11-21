import request from '@/utils/request'


//#region wipcai 管理
export function createCar(data) {
  return request({
    url: '/WipStorage/createCar',
    method: 'post',
    data
  })
}

export function deleteCar(data) {
  return request({
    url: '/WipStorage/deleteCar',
    method: 'delete',
    data
  })
}

export function updateCar(data) {
  return request({
    url: '/WipStorage/updateCar',
    method: 'post',
    data
  })
}

export function updateCarStatus(data) {
  return request({
    url: '/WipStorage/updateCarStatus',
    method: 'post',
    data
  })
}

export function fetchCarList(params) {
  return request({
    url: '/WipStorage/fetchCarList',
    method: 'get',
    params: params
  })
}

//#endregion



