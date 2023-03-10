export const state = () =>({
  user_token: process.browser ? localStorage.getItem('user_token') : null || null,
  user_auth_status: '',
})

export const getters = {
  getUserToken(){
    return state.user_token != null 
  },
  getAuthStaus(){
    return state.user_auth_status
  }
}

export const actions = {
  registerUserSPA(context, credentials){
    return new Promise((resolve, reject) => {

      this.$axios.$get('/sanctum/csrf-cookie')
      .then(response => {
        this.$axios.$post('/user/auth/spa/register', {
          username: credentials.username,
          email: credentials.email,
          password: credentials.password
        })
        
        .then(response => {
          context.commit('SET_AUTHENTICATION_STATUS', true)

          // context.dispatch('retrieveUserInfo')
          resolve(response)
        })

        resolve(response)
        .catch(function (error) {
          reject(error)
        })

      })
    })
  },

  loginUserSPA(context, credentials){
    return new Promise((resolve, reject) => {

      this.$axios.$get('/sanctum/csrf-cookie')
      .then(response => {
        this.$axios.$post('/user/auth/spa/login', {
          email: credentials.email,
          password: credentials.password
        })
        
        .then(response => {
          context.commit('SET_AUTHENTICATION', response.data)
          context.commit('SET_AUTHENTICATION_STATUS', true)
          context.dispatch('retrieveUserInfo')

          resolve(response)
        })

        resolve(response)
        .catch(function (error) {
          reject(error)
        })

      })
    })
  },

  registerUserToken(context, credentials) {
    return new Promise((resolve, reject) => {
      this.$axios.$post('/api/user/auth/token/register', {
        email: credentials.email,
        username: credentials.username,
        password: credentials.password,
      })
        .then(response => {
          context.commit('SET_USER_TOKEN', response.data.token)
          context.commit('SET_USER_AUTHENTICATION_STATUS', true)
          localStorage.setItem('user_token', response.data.token)
          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

  loginUserToken(context, credentials){
    return new Promise((resolve, reject) => {
      this.$axios.$post('/api/user/auth/token/login', {
        email: credentials.email,
        password: credentials.password
      })
        .then(response => {
          context.commit('SET_USER_TOKEN', response.data.token)
          context.commit('SET_USER_AUTHENTICATION_STATUS', true)
          localStorage.setItem('user_token', response.data.token)

          context.dispatch('retrieveUserInfo')

          resolve(response)
        })


        .catch(function (error) {
          reject(error)
        })
    })
  },

  verifyUserEmail(context, credentials){
    return new Promise((resolve, reject) => {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.user_token
      this.$axios.$post('/api/user/auth/email/verify', {
        verification_code: verification_code
      })
        .then(response => {

          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

  resendEmailVerification(context, credentials){
    return new Promise((resolve, reject) => {
      this.$axios.defaults.headers.common['Authorization'] = 'Bearer ' + context.state.user_token

      this.$axios.$get('/api/user/auth/email/resend_verification_code')
        .then(response => {

          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

  userFacebookLogin(context, credentials){
    return new Promise((resolve, reject) => {
      this.$axios.$post('/api/user/auth/oauth2/facebook', {
        email: credentials.email,
        password: credentials.password
      })
        .then(response => {
          context.commit('SET_FACEBOOK_TOKEN', response.data.token)
          context.commit('SET_ADMIN_AUTHENTICATION_STATUS', true)

          context.dispatch('retrieveUserInfo')

          resolve(response)
        })


        .catch(function (error) {
          reject(error)
        })
    })
  }

}

export const mutations = {
  SET_USER_AUTHENTICATION_STATUS(state, payload){
    state.user_auth_status = payload
  },

  SET_USER_TOKEN(state, payload){
    state.user_token = payload
  }
}