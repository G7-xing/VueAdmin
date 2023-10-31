import request from '@/utils/request'

export function getMenuList(addFlag) {
  return request({
    url: '/Menu/List',
    method: 'get',
    params: { addFlag }
  })
}

export function addMenu(data,id) {
    return request({
      url: `/Menu/${!id ? 'AddMenu':'UpdateMenu'}`,
      method: 'post',
      data  
    })
  }

  export function deleteMenu(MenuId) {
    return request({
      url: '/Menu/DeleteMenu',
      method: 'get',
      params: { MenuId } 
    })
  }

 

  export function getMenuInfo(MenuId) {
    return request({
      url: '/Menu/GetMenuInfo',
      method: 'get',
      params: { MenuId }
    })
  }