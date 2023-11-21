import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {path: '/login',component: () => import('@/views/login/index'),hidden: true},
  {path: '/404',component: () => import('@/views/404'),hidden: true },
  {
    path: '/',
    component: Layout,
    redirect: '/home',
    children: [{
      path: 'home',
      name: 'home',
      component: () => import('@/views/home/index'),
      meta: { title: '首页', icon: 'el-icon-menu' }
    }]
  },
  {
    path: '/attendanceDemo',
    component: Layout,
    redirect: '/attendanceDemo/index',
    children: [
      {
        path: 'index',
        component: () => import('@/views/attendanceDemo/index'),
        name: 'attendanceDemo',
        meta: { title: '考勤相关', icon: 'el-icon-message-solid' }
      }
    ]
  },
  
  // {
  //   path: '/nested',
  //   component: Layout,
  //   redirect: '/nested/menu1',
  //   name: 'Nested',
  //   meta: {
  //     title: 'Nested',
  //     icon: 'nested'
  //   },
  //   children: [
  //     {
  //       path: 'menu1',
  //       component: () => import('@/views/nested/menu1/index'), // Parent router-view
  //       name: 'Menu1',
  //       meta: { title: 'Menu1' },
  //       children: [
  //         {
  //           path: 'menu1-1',
  //           component: () => import('@/views/nested/menu1/menu1-1'),
  //           name: 'Menu1-1',
  //           meta: { title: 'Menu1-1' }
  //         },
  //         {
  //           path: 'menu1-2',
  //           component: () => import('@/views/nested/menu1/menu1-2'),
  //           name: 'Menu1-2',
  //           meta: { title: 'Menu1-2' },
  //           children: [
  //             {
  //               path: 'menu1-2-1',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
  //               name: 'Menu1-2-1',
  //               meta: { title: 'Menu1-2-1' }
  //             },
  //             {
  //               path: 'menu1-2-2',
  //               component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
  //               name: 'Menu1-2-2',
  //               meta: { title: 'Menu1-2-2' }
  //             }
  //           ]
  //         },
  //         {
  //           path: 'menu1-3',
  //           component: () => import('@/views/nested/menu1/menu1-3'),
  //           name: 'Menu1-3',
  //           meta: { title: 'Menu1-3' }
  //         }
  //       ]
  //     },
  //     {
  //       path: 'menu2',
  //       component: () => import('@/views/nested/menu2/index'),
  //       name: 'Menu2',
  //       meta: { title: 'menu2' }
  //     }
  //   ]
  // },
  // 404 page must be placed at the end !!!
]

export const asyncRouterMap = [
 
  {
    path: '/wipStorageDemo',
    component: Layout,
    alwaysShow: true,
    name: 'wipStorageDemo',
    meta: { title: 'WIP仓储管理', icon: 'warehouse_icon' },
    children: [
      {
        path: 'actionWipStorage',
        name: 'actionWipStorage',
        component: () => import('@/views/wipStorageDemo/actionWipStorage/index'),
        meta: { title: '仓储工作台', icon: 'warehouse_keep_icon' }
      },
      {
        path: 'queryWipstorage',
        name: 'queryWipstorage',
        component: () => import('@/views/wipStorageDemo/queryWipstorage/index'),
        meta: { title: '在库信息查询', icon: 'warehouse_query_icon' }
      },
      {
        path: 'baseInfoWipStorage',
        name: 'baseInfoWipStorage',
        component: ()=>import('@/views/wipStorageDemo/baseInfoWipStorage'),
        meta: { title: '基础信息维护', icon: 'warehouse_info_icon' },
        children:[
          {
            path: 'wipMagazineInfo',
            name: 'wipMagazineInfo',
            component: () => import('@/views/wipStorageDemo/baseInfoWipStorage/wipMagazineInfo/index'),
            meta: { title: 'Magazine信息', icon: 'warehouse_storage_icon' }
          },
          {
            path: 'wipCarInfo',
            name: 'wipCarInfo',
            component: () => import('@/views/wipStorageDemo/baseInfoWipStorage/wipCarInfo/index'),
            meta: { title: 'Car信息', icon: 'warehouse_car_icon' }
          },
          {
            path: 'wipLoactionStoreInfo',
            name: 'wipLoactionStoreInfo',
            component: () => import('@/views/wipStorageDemo/baseInfoWipStorage/wipLoactionStoreInfo/index'),
            meta: { title: '库位信息', icon: 'warehouse_location_icon' }
          },
        ]
      }, 
      // {
      //   path: 'ASMSetupCenter',
      //   name: 'ASMSetupCenter',
      //   component: () => import('@/views/MPSDemo/ASMSetupCenter/index'),
      //   meta: { title: 'ASM上料信息查询', icon: 'bars_connectivity' }
      // }, 
    ]
  },
  {
    path: '/MPSDemo',
    component: Layout,
    alwaysShow: true,
    name: 'MPSDemo',
    meta: { title: 'MPS管理', icon: 'analytics_graph' },
    children: [
      {
        path: 'MPSKanban',
        name: 'MPSKanban',
        component: () => import('@/views/MPSDemo/MPSKanban/index'),
        meta: { title: 'MPSKanban', icon: 'bar_chart' }
      },
      {
        path: 'PickOrderHistory',
        name: 'PickOrderHistory',
        component: () => import('@/views/MPSDemo/PickOrderHistory/index'),
        meta: { title: '物料需求订单查询', icon: 'analystics_business' }
      },
      {
        path: 'PickupReport',
        name: 'PickupReport',
        component: () => import('@/views/MPSDemo/PickupReport/index'),
        meta: { title: '配料记录查询', icon: 'songtianxing' }
      }, 
      {
        path: 'ASMSetupCenter',
        name: 'ASMSetupCenter',
        component: () => import('@/views/MPSDemo/ASMSetupCenter/index'),
        meta: { title: 'ASM上料信息查询', icon: 'bars_connectivity' }
      }, 
    ]
  },
  {
    path: '/CTReportDemo',
    component: Layout,
    alwaysShow: true,
    name: 'CTReportDemo',
    meta: { title: 'CT报表管理', icon: 'el-icon-s-data' },
    children: [
      {
        path: 'CTReport',
        name: 'CTReport',
        component: () => import('@/views/CTReportDemo/CTReport/index'),
        meta: { title: 'CTReport', icon: 'el-icon-data-line' }
      },
      // {
      //   path: 'EWIFile',
      //   name: 'EWIFile',
      //   component: () => import('@/views/demo/EWIFile/index'),
      //   meta: { title: 'EWIFile管理', icon: 'el-icon-s-cooperation' }
      // },
      // {
      //   path: 'previewDemo',
      //   name: 'previewDemo',
      //   component: () => import('@/views/demo/previewDemo/index'),
      //   meta: { title: 'EWI浏览', icon: 'el-icon-s-order' }
      // }, 
    ]
  },
  {
    path: '/demo',
    component: Layout,
    alwaysShow: true,
    name: 'demo',
    meta: { title: 'EWI管理', icon: 'nested' },
    children: [
      {
        path: 'line',
        name: 'line',
        component: () => import('@/views/demo/line/index'),
        meta: { title: '线体管理', icon: 'el-icon-user-solid' }
      },
      {
        path: 'EWIFile',
        name: 'EWIFile',
        component: () => import('@/views/demo/EWIFile/index'),
        meta: { title: 'EWIFile管理', icon: 'el-icon-s-cooperation' }
      },
      {
        path: 'previewDemo',
        name: 'previewDemo',
        component: () => import('@/views/demo/previewDemo/index'),
        meta: { title: 'EWI浏览', icon: 'el-icon-s-order' }
      },
      
    ]
  },
  {
    path: '/system',
    component: Layout,
    redirect: '/system/user',
    name: 'system',
    meta: { title: '系统管理', icon: 'el-icon-setting' },
    children: [
      {
        path: 'user',
        name: 'user',
        component: () => import('@/views/system/user/index'),
        meta: { title: '用户管理', icon: 'el-icon-user-solid' }
      },
      {
        path: 'role',
        name: 'role',
        component: () => import('@/views/system/role/index'),
        meta: { title: '角色管理', icon: 'el-icon-paperclip' }
      },
      {
        path: 'department',
        name: 'department',
        component: () => import('@/views/system/department/index'),
        meta: { title: '部门管理', icon: 'el-icon-suitcase' }
      },
      {
        path: 'menu',
        name: 'menu',
        component: () => import('@/views/system/menu/index'),
        meta: { title: '菜单管理', icon: 'el-icon-collection' }
      },
    ]
  },
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes,
  isAddDynamicMenuRoutes: false //是否已经添加动态(菜单)路由
})

const router = createRouter()

//Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
