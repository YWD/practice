import Vue from 'vue'
import Router from 'vue-router'
import { normalizeURL, decode } from 'ufo'
import { interopDefault } from './utils'
import scrollBehavior from './router.scrollBehavior.js'

const _3d820722 = () => interopDefault(import('../pages/layout' /* webpackChunkName: "" */))
const _98cac252 = () => interopDefault(import('../pages/home' /* webpackChunkName: "" */))
const _801cf71e = () => interopDefault(import('../pages/login' /* webpackChunkName: "" */))
const _62c8fcb1 = () => interopDefault(import('../pages/profile' /* webpackChunkName: "" */))
const _f0d2abca = () => interopDefault(import('../pages/settings' /* webpackChunkName: "" */))
const _31b32d65 = () => interopDefault(import('../pages/editor' /* webpackChunkName: "" */))
const _49933ffe = () => interopDefault(import('../pages/article' /* webpackChunkName: "" */))

const emptyFn = () => {}

Vue.use(Router)

export const routerOptions = {
  mode: 'history',
  base: '/',
  linkActiveClass: 'nuxt-link-active',
  linkExactActiveClass: 'active',
  scrollBehavior,

  routes: [{
    path: "/",
    component: _3d820722,
    children: [{
      path: "",
      component: _98cac252,
      name: "home"
    }, {
      path: "/login",
      component: _801cf71e,
      name: "login"
    }, {
      path: "/register",
      component: _801cf71e,
      name: "register"
    }, {
      path: "/profile/:username",
      component: _62c8fcb1,
      name: "profile"
    }, {
      path: "/settings",
      component: _f0d2abca,
      name: "settings"
    }, {
      path: "/editor",
      component: _31b32d65,
      name: "editor"
    }, {
      path: "/article/:slug",
      component: _49933ffe,
      name: "article"
    }]
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
