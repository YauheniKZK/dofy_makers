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
      redirect: '/feeds/main',
      component: () => import('../pages/feeds/Index.vue'),
      children: [
        {
          path: '/feeds/main',
          name: 'feeds-main',
          component: () => import('../pages/feeds/Main.vue')
        }
      ]
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
      redirect: '/workshop/main',
      component: () => import('../pages/workshop/Index.vue'),
      children: [
        {
          path: '/workshop/main',
          name: 'workshop-main',
          component: () => import('../pages/workshop/Main.vue')
        },
        {
          path: '/workshop/my-works',
          name: 'my-works',
          component: () => import('../pages/workshop/Products.vue')
        },
        {
          path: '/workshop/tools',
          name: 'tools',
          component: () => import('../pages/workshop/Tools.vue')
        },
        {
          path: '/workshop/materials',
          name: 'materials',
          component: () => import('../pages/workshop/Materials.vue')
        },
        {
          path: '/workshop/services',
          name: 'services',
          component: () => import('../pages/workshop/Services.vue')
        },
        {
          path: '/workshop/folders',
          name: 'folders',
          component: () => import('../pages/workshop/Folders.vue')
        },
        {
          path: '/workshop/folder-item/:id',
          name: 'folder-item',
          props: true,
          component: () => import('../pages/workshop/FolderItem.vue')
        }
      ]
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