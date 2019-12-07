import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    component: Home,
  },
  {
    path: '/points',
    name: 'points',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "points" */ '../views/Points.vue'),
  },
  {
    path: '/monthly',
    name: 'monthly',
    component: () => import(/* webpackChunkName: "monthly" */ '../views/Monthly.vue'),
  },
  {
    path: '/quarterly',
    name: 'quarterly',
    component: () => import(/* webpackChunkName: "quarterly" */ '../views/Quarterly.vue'),
  },
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
})

export default router
