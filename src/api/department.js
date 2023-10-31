import request from '@/utils/request'

export function getDepartDataList() {
  return request({
    url: '/Department/List',
    method: 'get'
  })
}

export function addDepartment(data,id) {
    return request({
      url: `/Department/${!id ? 'AddDepartment':'UpdateDepartment'}`,
      method: 'post',
      data  
    })
  }

  export function deleteDepartment(departmentId) {
    return request({
      url: '/Department/DeleteDepartment',
      method: 'get',
      params: { departmentId } 
    })
  }

 

  export function getDepartmentInfo(departmentId) {
    return request({
      url: '/Department/GetDepartmentInfo',
      method: 'get',
      params: { departmentId }
    })
  }