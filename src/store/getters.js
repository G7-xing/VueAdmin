const getters = {
  sidebar: state => state.app.sidebar,
  device: state => state.app.device,
  token: state => state.user.token,
  //avatar: state => state.user.avatar,
  visitedViews: state => state.tagsView.visitedViews,
  cachedViews: state => state.tagsView.cachedViews,
  username: state => state.user.username,
  userid: state => state.user.userid,
  nickname: state => state.user.nickname,
  departmentid: state => state.user.departmentid,
  roleName: state=>state.user.roleName,
  addRouters: state => state.permission.addRouters,
  routers: state => state.permission.routers
}
export default getters
