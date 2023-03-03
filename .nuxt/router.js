import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4f061ff4 = () => interopDefault(import('..\\pages\\forgot.vue' /* webpackChunkName: "pages/forgot" */))
const _07f316a8 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _42c9ab69 = () => interopDefault(import('..\\pages\\signup.vue' /* webpackChunkName: "pages/signup" */))
const _538648db = () => interopDefault(import('..\\pages\\users\\index.vue' /* webpackChunkName: "pages/users/index" */))
const _23a82a4a = () => interopDefault(import('..\\pages\\verify.vue' /* webpackChunkName: "pages/verify" */))
const _f6e0e41c = () => interopDefault(import('..\\pages\\users\\profile.vue' /* webpackChunkName: "pages/users/profile" */))
const _3e4b7391 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'nuxt-link-exact-active',
  scrollBehavior,

  routes: [{
    path: "/forgot",
    component: _4f061ff4,
    name: "forgot"
  }, {
    path: "/login",
    component: _07f316a8,
    name: "login"
  }, {
    path: "/signup",
    component: _42c9ab69,
    name: "signup"
  }, {
    path: "/users",
    component: _538648db,
    name: "users"
  }, {
    path: "/verify",
    component: _23a82a4a,
    name: "verify"
  }, {
    path: "/users/profile",
    component: _f6e0e41c,
    name: "users-profile"
  }, {
    path: "/",
    component: _3e4b7391,
    name: "index"
  }],

  fallback: false
}

export function createRouter (ssrContext, config) {
  const base = (config._app && config._app.basePath) || routerOptions.base
  const router = new Router({ ...routerOptions, base  })

  // TODO: remove in Nuxt 3
  const originalPush = router.push
  router.push = function push (location, onComplete = emptyFn, onAbort) {
    return originalPush.call(this, location, onComplete, onAbort)
  }

  const resolve = router.resolve.bind(router)
  router.resolve = (to, current, append) => {
    if (typeof to === 'string') {
      to = normalizeURL(to)
    }
    return resolve(to, current, append)
  }

  return router
}
