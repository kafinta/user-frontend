import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4f061ff4 = () => interopDefault(import('..\\pages\\forgot.vue' /* webpackChunkName: "pages/forgot" */))
const _07f316a8 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _ec253762 = () => interopDefault(import('..\\pages\\sellers\\index.vue' /* webpackChunkName: "pages/sellers/index" */))
const _42c9ab69 = () => interopDefault(import('..\\pages\\signup.vue' /* webpackChunkName: "pages/signup" */))
const _23a82a4a = () => interopDefault(import('..\\pages\\verify.vue' /* webpackChunkName: "pages/verify" */))
const _20f4fa91 = () => interopDefault(import('..\\pages\\sellers\\dashboard.vue' /* webpackChunkName: "pages/sellers/dashboard" */))
const _a3b4ea88 = () => interopDefault(import('..\\pages\\sellers\\earnings.vue' /* webpackChunkName: "pages/sellers/earnings" */))
const _900fd490 = () => interopDefault(import('..\\pages\\sellers\\orders.vue' /* webpackChunkName: "pages/sellers/orders" */))
const _7cd516ab = () => interopDefault(import('..\\pages\\sellers\\products\\index.vue' /* webpackChunkName: "pages/sellers/products/index" */))
const _84c4c734 = () => interopDefault(import('..\\pages\\sellers\\profile.vue' /* webpackChunkName: "pages/sellers/profile" */))
const _60c64594 = () => interopDefault(import('..\\pages\\sellers\\settings.vue' /* webpackChunkName: "pages/sellers/settings" */))
const _7596c68e = () => interopDefault(import('..\\pages\\sellers\\products\\new.vue' /* webpackChunkName: "pages/sellers/products/new" */))
const _3e4b7391 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _4fccbd46 = () => interopDefault(import('..\\pages\\_user\\buying\\index.vue' /* webpackChunkName: "pages/_user/buying/index" */))

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
    path: "/sellers",
    component: _ec253762,
    name: "sellers"
  }, {
    path: "/signup",
    component: _42c9ab69,
    name: "signup"
  }, {
    path: "/verify",
    component: _23a82a4a,
    name: "verify"
  }, {
    path: "/sellers/dashboard",
    component: _20f4fa91,
    name: "sellers-dashboard"
  }, {
    path: "/sellers/earnings",
    component: _a3b4ea88,
    name: "sellers-earnings"
  }, {
    path: "/sellers/orders",
    component: _900fd490,
    name: "sellers-orders"
  }, {
    path: "/sellers/products",
    component: _7cd516ab,
    name: "sellers-products"
  }, {
    path: "/sellers/profile",
    component: _84c4c734,
    name: "sellers-profile"
  }, {
    path: "/sellers/settings",
    component: _60c64594,
    name: "sellers-settings"
  }, {
    path: "/sellers/products/new",
    component: _7596c68e,
    name: "sellers-products-new"
  }, {
    path: "/",
    component: _3e4b7391,
    name: "index"
  }, {
    path: "/:user/buying",
    component: _4fccbd46,
    name: "user-buying"
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
