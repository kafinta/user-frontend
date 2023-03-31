import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _7cccddb8 = () => interopDefault(import('..\\pages\\artisans\\index.vue' /* webpackChunkName: "pages/artisans/index" */))
const _4f061ff4 = () => interopDefault(import('..\\pages\\forgot.vue' /* webpackChunkName: "pages/forgot" */))
const _07f316a8 = () => interopDefault(import('..\\pages\\login.vue' /* webpackChunkName: "pages/login" */))
const _42c9ab69 = () => interopDefault(import('..\\pages\\signup.vue' /* webpackChunkName: "pages/signup" */))
const _23a82a4a = () => interopDefault(import('..\\pages\\verify.vue' /* webpackChunkName: "pages/verify" */))
const _3b37977a = () => interopDefault(import('..\\pages\\artisans\\dashboard.vue' /* webpackChunkName: "pages/artisans/dashboard" */))
const _12172cb3 = () => interopDefault(import('..\\pages\\artisans\\earnings.vue' /* webpackChunkName: "pages/artisans/earnings" */))
const _2107c96f = () => interopDefault(import('..\\pages\\artisans\\orders.vue' /* webpackChunkName: "pages/artisans/orders" */))
const _76845f8f = () => interopDefault(import('..\\pages\\artisans\\profile.vue' /* webpackChunkName: "pages/artisans/profile" */))
const _7af32ffe = () => interopDefault(import('..\\pages\\artisans\\projects\\index.vue' /* webpackChunkName: "pages/artisans/projects/index" */))
const _338e7f2d = () => interopDefault(import('..\\pages\\artisans\\settings.vue' /* webpackChunkName: "pages/artisans/settings" */))
const _16c22268 = () => interopDefault(import('..\\pages\\artisans\\projects\\new.vue' /* webpackChunkName: "pages/artisans/projects/new" */))
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
    path: "/artisans",
    component: _7cccddb8,
    name: "artisans"
  }, {
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
    path: "/verify",
    component: _23a82a4a,
    name: "verify"
  }, {
    path: "/artisans/dashboard",
    component: _3b37977a,
    name: "artisans-dashboard"
  }, {
    path: "/artisans/earnings",
    component: _12172cb3,
    name: "artisans-earnings"
  }, {
    path: "/artisans/orders",
    component: _2107c96f,
    name: "artisans-orders"
  }, {
    path: "/artisans/profile",
    component: _76845f8f,
    name: "artisans-profile"
  }, {
    path: "/artisans/projects",
    component: _7af32ffe,
    name: "artisans-projects"
  }, {
    path: "/artisans/settings",
    component: _338e7f2d,
    name: "artisans-settings"
  }, {
    path: "/artisans/projects/new",
    component: _16c22268,
    name: "artisans-projects-new"
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
