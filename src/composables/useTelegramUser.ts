import { computed, ref } from 'vue'
import WebApp from '@twa-dev/sdk'

/**
 * Composable для работы с данными пользователя из Telegram WebApp
 * @returns Объект с данными пользователя из Telegram
 */
export function useTelegramUser() {
  // Получаем данные пользователя из WebApp
  const telegramUser = computed(() => {
    return WebApp?.initDataUnsafe?.user || null
  })

  // Получаем аватар пользователя
  const userAvatar = computed(() => {
    return telegramUser.value?.photo_url || null
  })

  // Получаем имя пользователя
  const userFirstName = computed(() => {
    return telegramUser.value?.first_name || null
  })

  // Получаем фамилию пользователя
  const userLastName = computed(() => {
    return telegramUser.value?.last_name || null
  })

  // Получаем полное имя пользователя
  const userFullName = computed(() => {
    const parts = []
    if (userFirstName.value) parts.push(userFirstName.value)
    if (userLastName.value) parts.push(userLastName.value)
    return parts.length > 0 ? parts.join(' ') : null
  })

  // Получаем ID пользователя
  const userId = computed(() => {
    return telegramUser.value?.id?.toString() || null
  })

  // Получаем username пользователя
  const username = computed(() => {
    return telegramUser.value?.username || null
  })

  // Проверяем, доступен ли аватар
  const hasAvatar = computed(() => {
    return !!userAvatar.value
  })

  return {
    telegramUser,
    userAvatar,
    userFirstName,
    userLastName,
    userFullName,
    userId,
    username,
    hasAvatar
  }
}
