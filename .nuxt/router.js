import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _4f061ff4 = () => interopDefault(import('..\\pages\\forgot.vue' /* webpackChunkName: "pages/forgot" */))
const _07f316a8 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _11ca9410 = () => interopDefault(import('..\\pages\\marketplace\\index.vue' /* webpackChunkName: "pages/marketplace/index" */))
const _42c9ab69 = () => interopDefault(import('..\\pages\\signup.vue' /* webpackChunkName: "pages/signup" */))
const _23a82a4a = () => interopDefault(import('..\\pages\\verify.vue' /* webpackChunkName: "pages/verify" */))
const _68fb2dd0 = () => interopDefault(import('..\\pages\\marketplace\\search\\index.vue' /* webpackChunkName: "pages/marketplace/search/index" */))
const _3e4b7391 = () => interopDefault(import('..\\pages\\index.vue' /* webpackChunkName: "pages/index" */))
const _4fccbd46 = () => interopDefault(import('..\\pages\\_user\\buying\\index.vue' /* webpackChunkName: "pages/_user/buying/index" */))
const _2551ce90 = () => interopDefault(import('..\\pages\\_user\\profile.vue' /* webpackChunkName: "pages/_user/profile" */))
const _5e6ef04c = () => interopDefault(import('..\\pages\\_user\\settings.vue' /* webpackChunkName: "pages/_user/settings" */))
const _76c7efa6 = () => interopDefault(import('..\\pages\\_user\\selling\\dashboard.vue' /* webpackChunkName: "pages/_user/selling/dashboard" */))
const _60d859a0 = () => interopDefault(import('..\\pages\\_user\\selling\\earnings.vue' /* webpackChunkName: "pages/_user/selling/earnings" */))
const _4fd79f9f = () => interopDefault(import('..\\pages\\_user\\selling\\inbox.vue' /* webpackChunkName: "pages/_user/selling/inbox" */))
const _6e194d9c = () => interopDefault(import('..\\pages\\_user\\selling\\orders.vue' /* webpackChunkName: "pages/_user/selling/orders" */))
const _748a7f47 = () => interopDefault(import('..\\pages\\_user\\selling\\products\\index.vue' /* webpackChunkName: "pages/_user/selling/products/index" */))
const _05b90756 = () => interopDefault(import('..\\pages\\_user\\selling\\products\\new.vue' /* webpackChunkName: "pages/_user/selling/products/new" */))
const _2e43b509 = () => interopDefault(import('..\\pages\\_user\\_product\\index.vue' /* webpackChunkName: "pages/_user/_product/index" */))

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
    path: "/marketplace",
    component: _11ca9410,
    name: "marketplace"
  }, {
    path: "/signup",
    component: _42c9ab69,
    name: "signup"
  }, {
    path: "/verify",
    component: _23a82a4a,
    name: "verify"
  }, {
    path: "/marketplace/search",
    component: _68fb2dd0,
    name: "marketplace-search"
  }, {
    path: "/",
    component: _3e4b7391,
    name: "index"
  }, {
    path: "/:user/buying",
    component: _4fccbd46,
    name: "user-buying"
  }, {
    path: "/:user/profile",
    component: _2551ce90,
    name: "user-profile"
  }, {
    path: "/:user/settings",
    component: _5e6ef04c,
    name: "user-settings"
  }, {
    path: "/:user/selling/dashboard",
    component: _76c7efa6,
    name: "user-selling-dashboard"
  }, {
    path: "/:user/selling/earnings",
    component: _60d859a0,
    name: "user-selling-earnings"
  }, {
    path: "/:user/selling/inbox",
    component: _4fd79f9f,
    name: "user-selling-inbox"
  }, {
    path: "/:user/selling/orders",
    component: _6e194d9c,
    name: "user-selling-orders"
  }, {
    path: "/:user/selling/products",
    component: _748a7f47,
    name: "user-selling-products"
  }, {
    path: "/:user/selling/products/new",
    component: _05b90756,
    name: "user-selling-products-new"
  }, {
    path: "/:user/:product",
    component: _2e43b509,
    name: "user-product"
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
