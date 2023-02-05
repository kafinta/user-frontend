export const state = () => ({
    search_box: false,
})

export const getters = {
    getSearchBox(state) {
        return state.search_box
    },
}

export const actions = {

    toggleSearchBox(context,) {
        context.commit('SET_SEARCHBOX')
    },

}

export const mutations = {

    SET_SEARCHBOX(state) {
        if(state.search_box == true) {
            state.search_box = false
        }else {
            state.search_box = true
        }
    }

}