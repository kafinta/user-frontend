export const state = () =>({
  token: process.browser ? localStorage.getItem('token') : null || null,
  auth_status: '',
  user: {},
})

export const getters = {
  getUserToken(){
    return state.token != null 
  },

  getAuthStaus(){
    return state.auth_status
  }
}

export const actions = {
  registerUser(context, credentials) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('/api/users/auth/register', {
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
      })
        .then(response => {
          context.commit('SET_TOKEN', response.data.token)
          context.commit('SET_AUTHENTICATION_STATUS', true)
          localStorage.setItem('token', response.data.token)
          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

  loginUser(context, credentials){
    return new Promise((resolve, reject) => {
      this.$axios.$post('/api/user/auth/token/login', {
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

  retrieveStudentInfo(context, credentials) {
    return new Promise((resolve, reject) => {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.session_token

      this.$axios.$get('/api/user/account')
        .then(response => {
          context.commit('SET_USER_INFO', response.data)

          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

  // verifyUserEmail(context, credentials){
  //   return new Promise((resolve, reject) => {
  //     this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.user_token
  //     this.$axios.$post('/api/user/auth/email/verify', {
  //       verification_code: verification_code
  //     })
  //       .then(response => {

  //         resolve(response)
  //       })

  //       .catch(function (error) {
  //         reject(error)
  //       })
  //   })
  // },

  // resendEmailVerification(context, credentials){
  //   return new Promise((resolve, reject) => {
  //     this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.user_token

  //     this.$axios.$get('/api/user/auth/email/resend_verification_code')
  //       .then(response => {

  //         resolve(response)
  //       })

  //       .catch(function (error) {
  //         reject(error)
  //       })
  //   })
  // },

  // userFacebookLogin(context, credentials){
  //   return new Promise((resolve, reject) => {
  //     this.$axios.$post('/api/user/auth/oauth2/facebook', {
  //       email: credentials.email,
  //       password: credentials.password
  //     })
  //       .then(response => {
  //         context.commit('SET_FACEBOOK_TOKEN', response.data.token)
  //         context.commit('SET_ADMIN_AUTHENTICATION_STATUS', true)

  //         context.dispatch('retrieveUserInfo')

  //         resolve(response)
  //       })


  //       .catch(function (error) {
  //         reject(error)
  //       })
  //   })
  // }

}

export const mutations = {
  SET_USER_AUTHENTICATION_STATUS(state, payload){
    state.auth_status = payload
  },

  SET_USER_TOKEN(state, payload){
    state.token = payload
  },

  SET_USER_INFO(state, payload){
    state.user = payload
  }
}