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
    }
  ]
}