export const state = () => ({
  view: '',
  books: [],
  categories: [],
  groups: []
})

export const getters = {
  getAllBooks(state){
    return state.books
  },

  getCategories(state){
    return state.categories
  },

  getGroups(state){
    return state.groups
  },

  getViewType(state){
    return state.view
  }
}

export const actions = {
  listAllBooks(context){
    return new Promise((resolve, reject) => {

      this.$axios.$get('/api/public/books')
        .then(response => {
          context.commit('LIST_BOOKS', response.data)

          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

  retrieveAllCategories(context){
    return new Promise((resolve, reject) => {

      this.$axios.$get('/api/public/categories')
        .then(response => {
          context.commit('SET_CATEGORIES', response.data)

          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

  retrieveAllGroups(context){
    return new Promise((resolve, reject) => {

      this.$axios.$get('/api/public/groups')
        .then(response => {
          context.commit('SET_GROUPS', response.data)

          resolve(response)
        })

        .catch(function (error) {
          reject(error)
        })
    })
  },

  changeView(context, type) {
    context.commit('SET_VIEW', type)
  },
}

export const mutations = {
  LIST_BOOKS(state, payload){
    state.books = payload
  },

  SET_CATEGORIES(state, payload){
    state.categories = payload
  },

  SET_GROUPS(state, payload) {
    state.groups = payload
  },

  SET_VIEW(state, payload){
    state.view = payload
    localStorage.setItem('book_view', payload)
  }
}