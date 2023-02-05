export const state = () => ({
    theme: '',
})

export const getters = {
    getTheme(state) {
        return state.theme
    },
}

export const actions = {

    switchTheme(context, theme) {
        context.commit('SET_THEME', theme)
    },

}

export const mutations = {

    SET_THEME(state, payload) {
        state.theme = payload
        localStorage.setItem('theme', payload)

        if (payload == 'dark') {
            document.documentElement.classList.add('dark')
            document.body.classList.add('text-accent1-800', 'dark:bg-accent1-900', 'dark:text-accent1-50')
        } else {
            document.documentElement.classList.remove('dark')
            document.body.classList.remove('text-accent1-800', 'dark:bg-accent1-900', 'dark:text-accent1-50')
        }
    },

}