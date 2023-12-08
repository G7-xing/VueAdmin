import request from '@/utils/request'

//#region   wipLoationArea
export function fectchLocationArea() {
  return request({
    url: '/WipStorage/fectchLocationArea',
    method: 'get',
  })
}
//#endregion

//#region wipcar 管理
export function createCar(data) {
  return request({
    url: '/WipStorage/createCar',
    method: 'post',
    data
  })
}
export function createBatchCar(data) {
  return request({
    url: '/WipStorage/createBatchCar',
    method: 'post',
    data
  })
}

export function deleteCar(wipCarId) {
  return request({
    url: '/WipStorage/deleteCar',
    method: 'get',
    params: { wipCarId }
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
  debugger
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


//#region wipStorageLocation 管理
export function createLocation(data) {
  return request({
    url: '/WipStorage/createLocation',
    method: 'post',
    data
  })
}
export function createBatchLocation(data) {
  return request({
    url: '/WipStorage/createBatchLocation',
    method: 'post',
    data
  })
}

export function deleteLocation(wipStorageLocationId) {
  return request({
    url: '/WipStorage/deleteLocation',
    method: 'get',
    params: { wipStorageLocationId }
  })
}

export function updateLocation(data) {
  return request({
    url: '/WipStorage/updateLocation',
    method: 'post',
    data
  })
}

export function updateLocationStatus(data) {
  return request({
    url: '/WipStorage/updateLocationStatus',
    method: 'post',
    data
  })
}

export function fetchLocationList(params) {
  return request({
    url: '/WipStorage/fetchLocationList',
    method: 'get',
    params: params
  })
}

//#endregion

//#region magazine
export function fetchMagazineList(params) {
  return request({
    url: '/WipStorage/fetchMagazineList',
    method: 'get',
    params: params
  })
}
//#endregion

//#region  bangdingAPI
/// car
export function checkCarIsFullByCarNo(carNo) {
  return request({
    url: '/WipStorage/checkCarIsFullByCarNo',
    method: 'get',
    params: { carNo }
  })
}

export function checkMagazineIsValidByNo(magazineNo) {
  return request({
    url: '/WipStorage/checkMagazineIsValidByNo',
    method: 'get',
    params: { magazineNo }
  })
}
export function saveCarWithMagazineInfo(data) {
  return request({
    url: '/WipStorage/saveCarWithMagazineInfo',
    method: 'post',
    data
  })
}
// location
export function checkLoctionIsValidByNo(locationNo) {
  return request({
    url: '/WipStorage/checkLoctionIsValidByNo',
    method: 'get',
    params: { locationNo }
  })
}

export function checkFullMagazineCarIsValidByNo(carNo) {
  return request({
    url: '/WipStorage/checkFullMagazineCarIsValidByNo',
    method: 'get',
    params: { carNo }
  })
}
export function saveLocationWithCarInfo(data) {
  return request({
    url: '/WipStorage/saveLocationWithCarInfo',
    method: 'post',
    data
  })
}
//#endregion

//#region  unbindAPI 

// carWithLocation
export function checkUnbindLocationIsValidByNo(locationNo) {
  return request({
    url: '/WipStorage/checkUnbindLocationIsValidByNo',
    method: 'get',
    params: { locationNo }
  })
}
export function unbindLocationWithCarInfo(data) {
  return request({
    url: '/WipStorage/unbindLocationWithCarInfo',
    method: 'post',
    data
  })
}
export function getInStorageDataByPcbaNo(pcbaNo) {
  return request({
    url: '/WipStorage/getInStorageDataByPcbaNo',
    method: 'get',
    params: { pcbaNo }
  })
}
//#endregion