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
      path: '/dashboard',
      name: 'dashboard',
      meta: {
        requiresAuth: false
      },
      component: () => import('../pages/dashboard/Main.vue')
    },
    {
      path: '/dashboard/statistics',
      name: 'statistics',
      meta: {
        requiresAuth: false
      },
      component: () => import('../pages/dashboard/Statistics.vue')
    },
    {
      path: '/dashboard/catalog',
      name: 'catalog',
      meta: {
        requiresAuth: false
      },
      component: () => import('../pages/dashboard/Catalog.vue')
    },
    {
      path: '/dashboard/profile',
      name: 'profile',
      meta: {
        requiresAuth: false
      },
      component: () => import('../pages/dashboard/Profile.vue')
    }
  ]
}