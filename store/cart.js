export const state = () => ({
    cart_drawer: false,
})

export const getters = {
    getCartDrawer(state) {
        return state.cart_drawer
    },
}

export const actions = {

    toggleCartDrawer(context,) {
        context.commit('SET_CART_DRAWER')
    },

}

export const mutations = {
    SET_CART_DRAWER(state) {
        if(state.cart_drawer == true) {
            state.cart_drawer = false
        }else {
            state.cart_drawer = true
        }
    }
}