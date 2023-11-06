import request from '@/utils/request'


/**
 * 看板的api
 * @returns 
 */
export function getDeatils() {
  return request({
    url: '/MPSKanban/getDeatils',
    method: 'get',
  })
}

//#region 物料需求订单查询api
export function fetchHistoryList(data) {
  return request({
    url: '/MPSKanban/fetchHistoryList',
    method: 'post',
    data
  })
}
//#endregion

//#region 配料记录api
export function fetchPickupList(data) {
  return request({
    url: '/MPSKanban/fetchPickupList',
    method: 'post',
    data
  })
}
//#endregion

//#region ASM上料信息查询api
export function fetchASMSetupList(data) {
  return request({
    url: '/MPSKanban/fetchASMSetupList',
    method: 'post',
    data
  })
}
//#endregion




