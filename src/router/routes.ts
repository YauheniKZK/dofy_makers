export default () => {
  return [
    {
      path: '/',
      name: 'start',
      meta: {
        requiresAuth: false
      },
      component: () => import('../pages/auth/Start.vue')
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        requiresAuth: false
      },
      component: () => import('../pages/auth/Login.vue')
    },
    {
      path: '/feeds',
      name: 'feeds',
      meta: {
        requiresAuth: true
      },
      component: () => import('../pages/feeds/Feeds.vue')
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      meta: {
        requiresAuth: true
      },
      component: () => import('../pages/knowledge/Knowledge.vue')
    }
  ]
}