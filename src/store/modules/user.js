import { login, logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'

const getDefaultState = () => {
  return {
    token: getToken(),
    username: '',
    userid: '',
    nickname:'',
    departmentid:'',
    roleName:''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_USERNAME: (state, username) => {
    state.username = username
  },
  SET_USERID: (state, userid) => {
    state.userid = userid
  },
  SET_NICKNAME:(state,nickname)=>{
    state.nickname = nickname
  },
  SET_DEPARTMENTID:(state,departmentid)=>{
    state.departmentid = departmentid
  },
  SET_ROLES: (state, roleName) => {
    state.roleName = roleName
  }
}

const actions = {
  // user login
  login({ commit }, userInfo) {
   
    const { UserName, Password } = userInfo
    return new Promise((resolve, reject) => {
      login({ UserName: UserName.trim(), password: Password }).then(response => {
        const { dynamicData } = response
        commit('SET_TOKEN', dynamicData.token)
        setToken(dynamicData.token)
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response;
        if (!data) {
          return reject('Verification failed, please Login again.')
        }
        //debugger
        if (data.roleName && data.roleName.length > 0) { // 验证返回的roles是否是一个非空数组
          commit('SET_ROLES', data.roleName)
        } else {
          return reject('getInfo: roles must be a non-null array !')
        }
        

        const { userName, userId, nickName,departmentId} = data;

        commit('SET_USERNAME', userName);
        commit('SET_USERID', userId);
        commit('SET_NICKNAME', nickName);
        commit('SET_DEPARTMENTID', departmentId);
        resolve(response)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

