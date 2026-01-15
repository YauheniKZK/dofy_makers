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
      redirect: '/knowledge/main',
      component: () => import('../pages/knowledge/Index.vue'),
      children: [
        {
          path: '/knowledge/main',
          name: 'knowledge-main',
          component: () => import('../pages/knowledge/Main.vue')
        },
        {
          path: 'manual',
          name: 'manual',
          component: () => import('../pages/knowledge/Manual.vue')
        },
        {
          path: 'recipes',
          name: 'recipes',
          component: () => import('../pages/knowledge/Recipes.vue')
        }
      ]
    },
    {
      path: '/workshop',
      name: 'workshop',
      meta: {
        requiresAuth: true
      },
      component: () => import('../pages/workshop/Workshop.vue')
    },
    {
      path: '/profile',
      name: 'profile',
      meta: {
        requiresAuth: true
      },
      redirect: '/profile/main',
      component: () => import('../pages/profile/Index.vue'),
      children: [
        {
          path: '/profile/main',
          name: 'profile-main',
          component: () => import('../pages/profile/Main.vue')
        }
      ]
    }
  ]
}