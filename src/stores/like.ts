import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getLikes,
  getLikeCount,
  getUserLikes,
  isLiked,
  like,
  unlike
} from '@/graphql/services/like'
import type { Like } from '@/graphql/queries/get-likes'
import type { UserLike } from '@/graphql/queries/get-user-likes'
import type { LikeInput } from '@/graphql/mutations/like'

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

export const useLikeStore = defineStore('like', () => {
  // -----------------STATE---------------------
  const likes = ref<Like[]>([])
  const likeCount = ref<number>(0)
  const userLikes = ref<UserLike[]>([])
  const isLikedValue = ref<boolean>(false)

  // Состояния для каждого API запроса
  const getLikesApiData = ref<ApiState<{ likes: Like[]; total: number }>>(createDefaultApiState<{ likes: Like[]; total: number }>())
  const getLikeCountApiData = ref<ApiState<number>>(createDefaultApiState<number>())
  const getUserLikesApiData = ref<ApiState<{ likes: UserLike[]; total: number }>>(createDefaultApiState<{ likes: UserLike[]; total: number }>())
  const isLikedApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())
  const likeApiData = ref<ApiState<Like>>(createDefaultApiState<Like>())
  const unlikeApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())

  // -----------------GETTERS---------------------
  const likesGetters = computed(() => likes.value)
  const likeCountGetters = computed(() => likeCount.value)
  const userLikesGetters = computed(() => userLikes.value)
  const isLikedGetters = computed(() => isLikedValue.value)

  // Геттеры для API состояний
  const getLikesApiDataGetters = computed(() => getLikesApiData.value)
  const getLikeCountApiDataGetters = computed(() => getLikeCountApiData.value)
  const getUserLikesApiDataGetters = computed(() => getUserLikesApiData.value)
  const isLikedApiDataGetters = computed(() => isLikedApiData.value)
  const likeApiDataGetters = computed(() => likeApiData.value)
  const unlikeApiDataGetters = computed(() => unlikeApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список лайков
  const fetchLikes = async (likeableType: string, likeableId: string, params?: { limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getLikesApiData.value)
    getLikesApiData.value.loading = true

    try {
      const response = await getLikes(likeableType, likeableId, params)

      if (response.data?.likes?.successfully && response.data.likes.data) {
        const data = response.data.likes.data
        likes.value = data.likes
        getLikesApiData.value.data = data
        getLikesApiData.value.success = true
        getLikesApiData.value.message = response.data.likes.message || 'Лайки загружены'
      } else {
        const errorMsg = response.data?.likes?.error || response.data?.likes?.message || 'Ошибка загрузки лайков'
        getLikesApiData.value.error = true
        getLikesApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки лайков'
      getLikesApiData.value.error = true
      getLikesApiData.value.message = errorMessage
    } finally {
      getLikesApiData.value.loading = false
    }
  }

  // Получить количество лайков
  const fetchLikeCount = async (likeableType: string, likeableId: string): Promise<number> => {
    resetApiState(getLikeCountApiData.value)
    getLikeCountApiData.value.loading = true

    try {
      const response = await getLikeCount(likeableType, likeableId)

      if (response.data?.likeCount?.successfully) {
        const count = response.data.likeCount.data
        likeCount.value = count
        getLikeCountApiData.value.data = count
        getLikeCountApiData.value.success = true
        getLikeCountApiData.value.message = response.data.likeCount.message || 'Количество лайков получено'
        return count
      } else {
        const errorMsg = response.data?.likeCount?.error || response.data?.likeCount?.message || 'Ошибка получения количества лайков'
        getLikeCountApiData.value.error = true
        getLikeCountApiData.value.message = errorMsg
        return 0
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка получения количества лайков'
      getLikeCountApiData.value.error = true
      getLikeCountApiData.value.message = errorMessage
      return 0
    } finally {
      getLikeCountApiData.value.loading = false
    }
  }

  // Получить лайки пользователя
  const fetchUserLikes = async (userId: string, likeableType?: string): Promise<void> => {
    resetApiState(getUserLikesApiData.value)
    getUserLikesApiData.value.loading = true

    try {
      const response = await getUserLikes(userId, likeableType)

      if (response.data?.userLikes?.successfully && response.data.userLikes.data) {
        const data = response.data.userLikes.data
        userLikes.value = data.likes
        getUserLikesApiData.value.data = data
        getUserLikesApiData.value.success = true
        getUserLikesApiData.value.message = response.data.userLikes.message || 'Лайки пользователя загружены'
      } else {
        const errorMsg = response.data?.userLikes?.error || response.data?.userLikes?.message || 'Ошибка загрузки лайков пользователя'
        getUserLikesApiData.value.error = true
        getUserLikesApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки лайков пользователя'
      getUserLikesApiData.value.error = true
      getUserLikesApiData.value.message = errorMessage
    } finally {
      getUserLikesApiData.value.loading = false
    }
  }

  // Проверить, лайкнул ли пользователь
  const checkIsLiked = async (userId: string, likeableType: string, likeableId: string): Promise<boolean> => {
    resetApiState(isLikedApiData.value)
    isLikedApiData.value.loading = true

    try {
      const response = await isLiked(userId, likeableType, likeableId)

      if (response.data?.isLiked?.successfully) {
        const liked = response.data.isLiked.data
        isLikedValue.value = liked
        isLikedApiData.value.data = liked
        isLikedApiData.value.success = true
        isLikedApiData.value.message = response.data.isLiked.message || 'Проверка выполнена'
        return liked
      } else {
        const errorMsg = response.data?.isLiked?.error || response.data?.isLiked?.message || 'Ошибка проверки лайка'
        isLikedApiData.value.error = true
        isLikedApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка проверки лайка'
      isLikedApiData.value.error = true
      isLikedApiData.value.message = errorMessage
      return false
    } finally {
      isLikedApiData.value.loading = false
    }
  }

  // Поставить лайк
  const likeAction = async (input: LikeInput): Promise<Like | null> => {
    resetApiState(likeApiData.value)
    likeApiData.value.loading = true

    try {
      const response = await like(input)

      if (response.data?.like?.successfully && response.data.like.data) {
        const likeItem = response.data.like.data
        likeApiData.value.data = likeItem
        likeApiData.value.success = true
        likeApiData.value.message = response.data.like.message || 'Лайк поставлен'
        
        // Обновляем количество лайков
        likeCount.value += 1
        
        return likeItem
      } else {
        const errorMsg = response.data?.like?.error || response.data?.like?.message || 'Ошибка постановки лайка'
        likeApiData.value.error = true
        likeApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка постановки лайка'
      likeApiData.value.error = true
      likeApiData.value.message = errorMessage
      return null
    } finally {
      likeApiData.value.loading = false
    }
  }

  // Убрать лайк
  const unlikeAction = async (likeableType: string, likeableId: string): Promise<boolean> => {
    resetApiState(unlikeApiData.value)
    unlikeApiData.value.loading = true

    try {
      const response = await unlike(likeableType, likeableId)

      if (response.data?.unlike?.successfully) {
        unlikeApiData.value.data = true
        unlikeApiData.value.success = true
        unlikeApiData.value.message = response.data.unlike.message || 'Лайк убран'
        
        // Обновляем количество лайков
        if (likeCount.value > 0) {
          likeCount.value -= 1
        }
        
        return true
      } else {
        const errorMsg = response.data?.unlike?.error || response.data?.unlike?.message || 'Ошибка удаления лайка'
        unlikeApiData.value.error = true
        unlikeApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления лайка'
      unlikeApiData.value.error = true
      unlikeApiData.value.message = errorMessage
      return false
    } finally {
      unlikeApiData.value.loading = false
    }
  }

  return {
    // State
    likes,
    likeCount,
    userLikes,
    isLikedValue,
    
    // API States
    getLikesApiData,
    getLikeCountApiData,
    getUserLikesApiData,
    isLikedApiData,
    likeApiData,
    unlikeApiData,
    
    // Getters
    likesGetters,
    likeCountGetters,
    userLikesGetters,
    isLikedGetters,
    
    // API Data Getters
    getLikesApiDataGetters,
    getLikeCountApiDataGetters,
    getUserLikesApiDataGetters,
    isLikedApiDataGetters,
    likeApiDataGetters,
    unlikeApiDataGetters,
    
    // Actions
    fetchLikes,
    fetchLikeCount,
    fetchUserLikes,
    checkIsLiked,
    likeAction,
    unlikeAction
  }
})
