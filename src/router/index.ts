import { createRouter, createWebHistory } from 'vue-router'
import getRoutes from "@/router/routes";

const router = createRouter({
  history: createWebHistory(),
  routes: getRoutes()
})

// Для Telegram Mini App авторизация происходит через telegramId на стартовой странице
// Дополнительная проверка авторизации не требуется
router.beforeEach(async (to, from, next) => {
  // Если маршрут требует авторизации, проверяем наличие пользователя в store
  if (to.meta.requiresAuth) {
    const { useUserStore } = await import('@/stores/user')
    const userStore = useUserStore()
    
    // Если нет пользователя в store, перенаправляем на стартовую страницу
    if (!userStore.currentUserGetters) {
      return next('/')
    }
  }

  next()
})

export default router
