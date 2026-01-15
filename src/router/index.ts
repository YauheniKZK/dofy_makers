import { createRouter, createWebHistory } from 'vue-router'
import getRoutes from "@/router/routes";

// Получаем base URL из переменной окружения или используем дефолтное значение
// Для GitHub Pages base должен быть с trailing slash: '/dofy_makers/'
const baseUrl = import.meta.env.BASE_URL || '/dofy_makers/'

const router = createRouter({
  history: createWebHistory(baseUrl),
  routes: getRoutes()
})

// Для Telegram Mini App авторизация происходит через telegramId на стартовой странице
router.beforeEach(async (to, from, next) => {
  // Логируем переход для отладки
  console.log('Router navigation:', { from: from.path, to: to.path, base: baseUrl })
  
  const { useUserStore } = await import('@/stores/user')
  const userStore = useUserStore()
  
  // Если пользователь заблокирован, всегда перенаправляем на стартовую страницу
  if (userStore.isBlocked) {
    if (to.path !== '/') {
      return next('/')
    }
    return next()
  }
  
  // Если пользователь авторизован (есть токен и пользователь в store) и находится на стартовой странице
  // перенаправляем на feeds
  if (to.path === '/' && userStore.isAuthenticated && userStore.currentUserGetters) {
    return next('/feeds')
  }
  
  // Если маршрут требует авторизации, проверяем наличие пользователя в store
  if (to.meta.requiresAuth) {
    // Если нет пользователя в store или токена, перенаправляем на стартовую страницу
    if (!userStore.currentUserGetters || !userStore.isAuthenticated) {
      return next('/')
    }
  }

  next()
})

// Обработка ошибок роутера
router.onError((error) => {
  console.error('Router error:', error)
})

export default router
