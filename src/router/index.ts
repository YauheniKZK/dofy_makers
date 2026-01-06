import { createRouter, createWebHashHistory } from 'vue-router'
import getRoutes from "@/router/routes";

// Получаем base URL из переменной окружения или используем дефолтное значение
const baseUrl = import.meta.env.BASE_URL || '/dofy_makers/'

const router = createRouter({
  // Используем hash routing для GitHub Pages - это работает без серверной конфигурации
  history: createWebHashHistory(baseUrl),
  routes: getRoutes()
})

// Для Telegram Mini App авторизация происходит через telegramId на стартовой странице
// Дополнительная проверка авторизации не требуется
router.beforeEach(async (to, from, next) => {
  // Логируем переход для отладки
  console.log('Router navigation:', { from: from.path, to: to.path, base: baseUrl })
  
  // Если маршрут требует авторизации, проверяем наличие пользователя в store
  if (to.meta.requiresAuth) {
    const { useUserStore } = await import('@/stores/user')
    const userStore = useUserStore()
    
    // Если нет пользователя в store, перенаправляем на стартовую страницу
    if (!userStore.currentUserGetters) {
      return next('/')
    }
    
    // Если пользователь заблокирован, перенаправляем на стартовую страницу
    if (userStore.isBlocked) {
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
