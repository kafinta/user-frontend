export const state = () =>({
  token: process.browser ? localStorage.getItem('token') : null || null,
  auth_status: false,
  user: {

  },
})

export const getters = {
  getUserToken(state){
    return state.token != null 
  },

  getAuthStaus(state){
    return state.auth_status
  },

  getUserInfo(state){
    return state.user
  }
}

export const actions = {
  registerUser(context, credentials) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('/api/user/auth/register', {
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
      })
        .then(response => {
          context.commit('SET_TOKEN', response.data.token)
          context.commit('SET_AUTHENTICATION_STATUS', true)
          localStorage.setItem('token', response.data.token)

          context.dispatch('retrieveUserInfo')

          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

  loginUser(context, credentials){
    return new Promise((resolve, reject) => {
      this.$axios.$post('/api/user/auth/login', {
        email: credentials.email,
        password: credentials.password
      })
        .then(response => {
          context.commit('SET_TOKEN', response.data.token)
          context.commit('SET_AUTHENTICATION_STATUS', true)
          localStorage.setItem('token', response.data.token)

          context.dispatch('retrieveUserInfo')

          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

  retrieveUserInfo(context) {
    return new Promise((resolve, reject) => {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.token

      this.$axios.$get('/api/user/account')
        .then(response => {
          context.commit('SET_AUTHENTICATION_STATUS', true)
          context.commit('SET_USER_INFO', response)
          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

}

export const mutations = {
  SET_AUTHENTICATION_STATUS(state, payload){
    state.auth_status = payload
  },

  SET_TOKEN(state, payload){
    state.token = payload
  },

  SET_USER_INFO(state, payload){
    state.user = payload
  }
}