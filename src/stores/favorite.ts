import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getFavorites,
  getFavoriteCount,
  getUserFavorites,
  isFavorite,
  addToFavorites,
  removeFromFavorites
} from '@/graphql/services/favorite'
import type { Favorite } from '@/graphql/queries/get-favorites'
import type { Favorite as FavoriteFromMutation } from '@/graphql/mutations/add-to-favorites'
import type { UserFavorite } from '@/graphql/queries/get-user-favorites'
import type { AddToFavoritesInput } from '@/graphql/mutations/add-to-favorites'

// Универсальный интерфейс для состояния запроса
interface ApiState<T = any> {
  data: T | null
  loading: boolean
  success: boolean
  error: boolean
  message: string
}

// Универсальная функция для создания дефолтного состояния
const createDefaultApiState = <T = any>(): ApiState<T> => ({
  data: null,
  loading: false,
  success: false,
  error: false,
  message: ''
})

// Универсальная функция для сброса состояния
const resetApiState = <T = any>(state: ApiState<T>): void => {
  state.data = null
  state.loading = false
  state.success = false
  state.error = false
  state.message = ''
}

export const useFavoriteStore = defineStore('favorite', () => {
  // -----------------STATE---------------------
  const favorites = ref<Favorite[]>([])
  const favoriteCount = ref<number>(0)
  const userFavorites = ref<UserFavorite[]>([])
  const isFavoriteValue = ref<boolean>(false)

  // Состояния для каждого API запроса
  const getFavoritesApiData = ref<ApiState<{ favorites: Favorite[]; total: number }>>(createDefaultApiState<{ favorites: Favorite[]; total: number }>())
  const getFavoriteCountApiData = ref<ApiState<number>>(createDefaultApiState<number>())
  const getUserFavoritesApiData = ref<ApiState<{ favorites: UserFavorite[]; total: number }>>(createDefaultApiState<{ favorites: UserFavorite[]; total: number }>())
  const isFavoriteApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())
  const addToFavoritesApiData = ref<ApiState<Favorite | FavoriteFromMutation>>(createDefaultApiState<Favorite | FavoriteFromMutation>())
  const removeFromFavoritesApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())

  // -----------------GETTERS---------------------
  const favoritesGetters = computed(() => favorites.value)
  const favoriteCountGetters = computed(() => favoriteCount.value)
  const userFavoritesGetters = computed(() => userFavorites.value)
  const isFavoriteGetters = computed(() => isFavoriteValue.value)

  // Геттеры для API состояний
  const getFavoritesApiDataGetters = computed(() => getFavoritesApiData.value)
  const getFavoriteCountApiDataGetters = computed(() => getFavoriteCountApiData.value)
  const getUserFavoritesApiDataGetters = computed(() => getUserFavoritesApiData.value)
  const isFavoriteApiDataGetters = computed(() => isFavoriteApiData.value)
  const addToFavoritesApiDataGetters = computed(() => addToFavoritesApiData.value)
  const removeFromFavoritesApiDataGetters = computed(() => removeFromFavoritesApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список пользователей, добавивших объект в избранное
  const fetchFavorites = async (favoriteableType: string, favoriteableId: string, params?: { limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getFavoritesApiData.value)
    getFavoritesApiData.value.loading = true

    try {
      const response = await getFavorites(favoriteableType, favoriteableId, params)

      if (response.data?.favorites?.successfully && response.data.favorites.data) {
        const data = response.data.favorites.data
        favorites.value = data.favorites
        getFavoritesApiData.value.data = data
        getFavoritesApiData.value.success = true
        getFavoritesApiData.value.message = response.data.favorites.message || 'Избранное загружено'
      } else {
        const errorMsg = response.data?.favorites?.error || response.data?.favorites?.message || 'Ошибка загрузки избранного'
        getFavoritesApiData.value.error = true
        getFavoritesApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки избранного'
      getFavoritesApiData.value.error = true
      getFavoritesApiData.value.message = errorMessage
    } finally {
      getFavoritesApiData.value.loading = false
    }
  }

  // Получить количество пользователей, добавивших объект в избранное
  const fetchFavoriteCount = async (favoriteableType: string, favoriteableId: string): Promise<number> => {
    resetApiState(getFavoriteCountApiData.value)
    getFavoriteCountApiData.value.loading = true

    try {
      const response = await getFavoriteCount(favoriteableType, favoriteableId)

      if (response.data?.favoriteCount?.successfully) {
        const count = response.data.favoriteCount.data
        favoriteCount.value = count
        getFavoriteCountApiData.value.data = count
        getFavoriteCountApiData.value.success = true
        getFavoriteCountApiData.value.message = response.data.favoriteCount.message || 'Количество добавлений в избранное получено'
        return count
      } else {
        const errorMsg = response.data?.favoriteCount?.error || response.data?.favoriteCount?.message || 'Ошибка получения количества избранного'
        getFavoriteCountApiData.value.error = true
        getFavoriteCountApiData.value.message = errorMsg
        return 0
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка получения количества избранного'
      getFavoriteCountApiData.value.error = true
      getFavoriteCountApiData.value.message = errorMessage
      return 0
    } finally {
      getFavoriteCountApiData.value.loading = false
    }
  }

  // Получить избранное пользователя
  const fetchUserFavorites = async (userId?: string, favoriteableType?: string, params?: { limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getUserFavoritesApiData.value)
    getUserFavoritesApiData.value.loading = true

    try {
      const response = await getUserFavorites(userId, favoriteableType, params)

      if (response.data?.userFavorites?.successfully && response.data.userFavorites.data) {
        const data = response.data.userFavorites.data
        userFavorites.value = data.favorites
        getUserFavoritesApiData.value.data = data
        getUserFavoritesApiData.value.success = true
        getUserFavoritesApiData.value.message = response.data.userFavorites.message || 'Избранное пользователя загружено'
      } else {
        const errorMsg = response.data?.userFavorites?.error || response.data?.userFavorites?.message || 'Ошибка загрузки избранного пользователя'
        getUserFavoritesApiData.value.error = true
        getUserFavoritesApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки избранного пользователя'
      getUserFavoritesApiData.value.error = true
      getUserFavoritesApiData.value.message = errorMessage
    } finally {
      getUserFavoritesApiData.value.loading = false
    }
  }

  // Проверить, добавлен ли объект в избранное
  const checkIsFavorite = async (favoriteableType: string, favoriteableId: string, userId?: string): Promise<boolean> => {
    resetApiState(isFavoriteApiData.value)
    isFavoriteApiData.value.loading = true

    try {
      const response = await isFavorite(favoriteableType, favoriteableId, userId)

      if (response.data?.isFavorite?.successfully) {
        const favorited = response.data.isFavorite.data
        isFavoriteValue.value = favorited
        isFavoriteApiData.value.data = favorited
        isFavoriteApiData.value.success = true
        isFavoriteApiData.value.message = response.data.isFavorite.message || 'Проверка выполнена'
        return favorited
      } else {
        const errorMsg = response.data?.isFavorite?.error || response.data?.isFavorite?.message || 'Ошибка проверки избранного'
        isFavoriteApiData.value.error = true
        isFavoriteApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка проверки избранного'
      isFavoriteApiData.value.error = true
      isFavoriteApiData.value.message = errorMessage
      return false
    } finally {
      isFavoriteApiData.value.loading = false
    }
  }

  // Добавить в избранное
  const addToFavoritesAction = async (input: AddToFavoritesInput): Promise<Favorite | FavoriteFromMutation | null> => {
    resetApiState(addToFavoritesApiData.value)
    addToFavoritesApiData.value.loading = true

    try {
      const response = await addToFavorites(input)

      if (response.data?.addToFavorites?.successfully && response.data.addToFavorites.data) {
        const favoriteItem = response.data.addToFavorites.data
        addToFavoritesApiData.value.data = favoriteItem as any as Favorite | FavoriteFromMutation
        addToFavoritesApiData.value.success = true
        addToFavoritesApiData.value.message = response.data.addToFavorites.message || 'Добавлено в избранное'
        
        // Обновляем состояние
        isFavoriteValue.value = true
        favoriteCount.value += 1
        
        return favoriteItem
      } else {
        const errorMsg = response.data?.addToFavorites?.error || response.data?.addToFavorites?.message || 'Ошибка добавления в избранное'
        addToFavoritesApiData.value.error = true
        addToFavoritesApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка добавления в избранное'
      addToFavoritesApiData.value.error = true
      addToFavoritesApiData.value.message = errorMessage
      return null
    } finally {
      addToFavoritesApiData.value.loading = false
    }
  }

  // Удалить из избранного
  const removeFromFavoritesAction = async (favoriteableType: string, favoriteableId: string): Promise<boolean> => {
    resetApiState(removeFromFavoritesApiData.value)
    removeFromFavoritesApiData.value.loading = true

    try {
      const response = await removeFromFavorites(favoriteableType, favoriteableId)

      if (response.data?.removeFromFavorites?.successfully) {
        removeFromFavoritesApiData.value.data = true
        removeFromFavoritesApiData.value.success = true
        removeFromFavoritesApiData.value.message = response.data.removeFromFavorites.message || 'Удалено из избранного'
        
        // Обновляем состояние
        isFavoriteValue.value = false
        if (favoriteCount.value > 0) {
          favoriteCount.value -= 1
        }
        
        return true
      } else {
        const errorMsg = response.data?.removeFromFavorites?.error || response.data?.removeFromFavorites?.message || 'Ошибка удаления из избранного'
        removeFromFavoritesApiData.value.error = true
        removeFromFavoritesApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления из избранного'
      removeFromFavoritesApiData.value.error = true
      removeFromFavoritesApiData.value.message = errorMessage
      return false
    } finally {
      removeFromFavoritesApiData.value.loading = false
    }
  }

  return {
    // State
    favorites,
    favoriteCount,
    userFavorites,
    isFavoriteValue,
    
    // API States
    getFavoritesApiData,
    getFavoriteCountApiData,
    getUserFavoritesApiData,
    isFavoriteApiData,
    addToFavoritesApiData,
    removeFromFavoritesApiData,
    
    // Getters
    favoritesGetters,
    favoriteCountGetters,
    userFavoritesGetters,
    isFavoriteGetters,
    
    // API Data Getters
    getFavoritesApiDataGetters,
    getFavoriteCountApiDataGetters,
    getUserFavoritesApiDataGetters,
    isFavoriteApiDataGetters,
    addToFavoritesApiDataGetters,
    removeFromFavoritesApiDataGetters,
    
    // Actions
    fetchFavorites,
    fetchFavoriteCount,
    fetchUserFavorites,
    checkIsFavorite,
    addToFavoritesAction,
    removeFromFavoritesAction
  }
})
