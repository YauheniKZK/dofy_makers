import { ref, watch, type Ref } from 'vue'
import { useRoute } from 'vue-router'

export interface RouteTransitionConfig {
  /**
   * Карта глубины маршрутов для определения направления перехода
   * Ключ - имя маршрута, значение - глубина (0 = корневой уровень)
   */
  routeDepth?: Record<string, number>
  
  /**
   * Функция для определения глубины маршрута по его пути
   * Если не указана, будет использоваться routeDepth по имени маршрута
   */
  getRouteDepth?: (path: string, name: string | symbol | null | undefined) => number
  
  /**
   * Направление перехода по умолчанию при переходе между страницами одного уровня
   */
  defaultDirection?: 'forward' | 'backward'
}

/**
 * Composable для определения направления перехода между маршрутами
 * Используется для анимации переходов в стиле iOS
 * 
 * @example
 * // Простое использование с картой глубины маршрутов
 * const { transitionName } = useRouteTransition({
 *   routeDepth: {
 *     'main': 0,
 *     'detail': 1,
 *     'sub-detail': 2
 *   }
 * })
 * 
 * @example
 * // Использование с кастомной функцией определения глубины
 * const { transitionName } = useRouteTransition({
 *   getRouteDepth: (path, name) => {
 *     if (path.includes('/detail')) return 1
 *     return 0
 *   }
 * })
 */
export function useRouteTransition(config: RouteTransitionConfig = {}) {
  const route = useRoute()
  const transitionName: Ref<'slide-left' | 'slide-right'> = ref('slide-left')
  const previousPath = ref<string | null>(null)
  
  const {
    routeDepth = {},
    getRouteDepth,
    defaultDirection = 'forward'
  } = config

  // Функция для определения глубины маршрута
  const determineDepth = (path: string, name: string | symbol | null | undefined): number => {
    if (getRouteDepth) {
      return getRouteDepth(path, name)
    }
    
    if (name && typeof name === 'string' && routeDepth[name] !== undefined) {
      return routeDepth[name]
    }
    
    // Попытка определить глубину по пути, если имя не найдено
    // Подсчитываем количество сегментов пути после базового пути
    const segments = path.split('/').filter(Boolean)
    return segments.length - 1
  }

  // Отслеживаем направление перехода
  watch(
    () => route.path,
    (to, from) => {
      if (!from || !previousPath.value) {
        previousPath.value = to
        transitionName.value = 'slide-left'
        return
      }

      const currentDepth = determineDepth(to, route.name)
      const previousDepth = determineDepth(previousPath.value, null)

      // Если переходим к маршруту с большей глубиной - это переход вперед (slide-left)
      // Если к меньшей - это переход назад (slide-right)
      if (currentDepth > previousDepth) {
        transitionName.value = 'slide-left'
      } else if (currentDepth < previousDepth) {
        transitionName.value = 'slide-right'
      } else {
        // При переходе между страницами одного уровня используем направление по умолчанию
        transitionName.value = defaultDirection === 'forward' ? 'slide-left' : 'slide-right'
      }

      previousPath.value = to
    },
    { immediate: true }
  )

  return {
    transitionName
  }
}
