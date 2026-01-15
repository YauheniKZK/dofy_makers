import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getSubscriptions,
  getSubscription,
  getSubscribers,
  isSubscribed,
  subscribe,
  unsubscribe
} from '@/graphql/services/subscription'
import type { Subscription } from '@/graphql/queries/get-subscriptions'
import type { Subscription as SubscriptionFromSubscribe } from '@/graphql/mutations/subscribe'
import type { Subscription as SubscriptionFromGetSubscribers } from '@/graphql/queries/get-subscribers'
import type { SubscribeInput } from '@/graphql/mutations/subscribe'

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

export const useSubscriptionStore = defineStore('subscription', () => {
  // -----------------STATE---------------------
  const subscriptions = ref<Subscription[]>([])
  const currentSubscription = ref<Subscription | null>(null)
  const subscribers = ref<Subscription[]>([])
  const isSubscribedValue = ref<boolean>(false)

  // Состояния для каждого API запроса
  const getSubscriptionsApiData = ref<ApiState<{ subscriptions: Subscription[]; total: number }>>(createDefaultApiState<{ subscriptions: Subscription[]; total: number }>())
  const getSubscriptionApiData = ref<ApiState<Subscription>>(createDefaultApiState<Subscription>())
  const getSubscribersApiData = ref<ApiState<{ subscriptions: Subscription[]; total: number }>>(createDefaultApiState<{ subscriptions: Subscription[]; total: number }>())
  const isSubscribedApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())
  const subscribeApiData = ref<ApiState<Subscription | SubscriptionFromSubscribe>>(createDefaultApiState<Subscription | SubscriptionFromSubscribe>())
  const unsubscribeApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())

  // -----------------GETTERS---------------------
  const subscriptionsGetters = computed(() => subscriptions.value)
  const currentSubscriptionGetters = computed(() => currentSubscription.value)
  const subscribersGetters = computed(() => subscribers.value)
  const isSubscribedGetters = computed(() => isSubscribedValue.value)

  // Геттеры для API состояний
  const getSubscriptionsApiDataGetters = computed(() => getSubscriptionsApiData.value)
  const getSubscriptionApiDataGetters = computed(() => getSubscriptionApiData.value)
  const getSubscribersApiDataGetters = computed(() => getSubscribersApiData.value)
  const isSubscribedApiDataGetters = computed(() => isSubscribedApiData.value)
  const subscribeApiDataGetters = computed(() => subscribeApiData.value)
  const unsubscribeApiDataGetters = computed(() => unsubscribeApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список подписок
  const fetchSubscriptions = async (userId: string, params?: { limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getSubscriptionsApiData.value)
    getSubscriptionsApiData.value.loading = true

    try {
      const response = await getSubscriptions(userId, params)

      if (response.data?.subscriptions?.successfully && response.data.subscriptions.data) {
        const data = response.data.subscriptions.data
        subscriptions.value = data.subscriptions
        getSubscriptionsApiData.value.data = data
        getSubscriptionsApiData.value.success = true
        getSubscriptionsApiData.value.message = response.data.subscriptions.message || 'Подписки загружены'
      } else {
        const errorMsg = response.data?.subscriptions?.error || response.data?.subscriptions?.message || 'Ошибка загрузки подписок'
        getSubscriptionsApiData.value.error = true
        getSubscriptionsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки подписок'
      getSubscriptionsApiData.value.error = true
      getSubscriptionsApiData.value.message = errorMessage
    } finally {
      getSubscriptionsApiData.value.loading = false
    }
  }

  // Получить подписку по ID
  const fetchSubscription = async (id: string): Promise<Subscription | null> => {
    resetApiState(getSubscriptionApiData.value)
    getSubscriptionApiData.value.loading = true

    try {
      const response = await getSubscription(id)

      if (response.data?.subscription?.successfully && response.data.subscription.data) {
        const subscription = response.data.subscription.data
        currentSubscription.value = subscription
        getSubscriptionApiData.value.data = subscription
        getSubscriptionApiData.value.success = true
        getSubscriptionApiData.value.message = response.data.subscription.message || 'Подписка загружена'
        return subscription
      } else {
        const errorMsg = response.data?.subscription?.error || response.data?.subscription?.message || 'Подписка не найдена'
        getSubscriptionApiData.value.error = true
        getSubscriptionApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки подписки'
      getSubscriptionApiData.value.error = true
      getSubscriptionApiData.value.message = errorMessage
      return null
    } finally {
      getSubscriptionApiData.value.loading = false
    }
  }

  // Получить список подписчиков
  const fetchSubscribers = async (userId: string, params?: { limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getSubscribersApiData.value)
    getSubscribersApiData.value.loading = true

    try {
      const response = await getSubscribers(userId, params)

      if (response.data?.subscribers?.successfully && response.data.subscribers.data) {
        const data = response.data.subscribers.data
        subscribers.value = data.subscriptions as any as Subscription[]
        getSubscribersApiData.value.data = { subscriptions: data.subscriptions as any as Subscription[], total: data.total }
        getSubscribersApiData.value.success = true
        getSubscribersApiData.value.message = response.data.subscribers.message || 'Подписчики загружены'
      } else {
        const errorMsg = response.data?.subscribers?.error || response.data?.subscribers?.message || 'Ошибка загрузки подписчиков'
        getSubscribersApiData.value.error = true
        getSubscribersApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки подписчиков'
      getSubscribersApiData.value.error = true
      getSubscribersApiData.value.message = errorMessage
    } finally {
      getSubscribersApiData.value.loading = false
    }
  }

  // Проверить, подписан ли пользователь
  const checkIsSubscribed = async (followerId: string, followingId: string): Promise<boolean> => {
    resetApiState(isSubscribedApiData.value)
    isSubscribedApiData.value.loading = true

    try {
      const response = await isSubscribed(followerId, followingId)

      if (response.data?.isSubscribed?.successfully) {
        const subscribed = response.data.isSubscribed.data
        isSubscribedValue.value = subscribed
        isSubscribedApiData.value.data = subscribed
        isSubscribedApiData.value.success = true
        isSubscribedApiData.value.message = response.data.isSubscribed.message || 'Проверка выполнена'
        return subscribed
      } else {
        const errorMsg = response.data?.isSubscribed?.error || response.data?.isSubscribed?.message || 'Ошибка проверки подписки'
        isSubscribedApiData.value.error = true
        isSubscribedApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка проверки подписки'
      isSubscribedApiData.value.error = true
      isSubscribedApiData.value.message = errorMessage
      return false
    } finally {
      isSubscribedApiData.value.loading = false
    }
  }

  // Подписаться
  const subscribeAction = async (input: SubscribeInput): Promise<Subscription | null> => {
    resetApiState(subscribeApiData.value)
    subscribeApiData.value.loading = true

    try {
      const response = await subscribe(input)

      if (response.data?.subscribe?.successfully && response.data.subscribe.data) {
        const subscription = response.data.subscribe.data
        subscribeApiData.value.data = subscription as any as Subscription | SubscriptionFromSubscribe
        subscribeApiData.value.success = true
        subscribeApiData.value.message = response.data.subscribe.message || 'Подписка создана'
        
        // Добавляем в список подписок
        subscriptions.value.push(subscription as any as Subscription)
        
        return subscription as any as Subscription
      } else {
        const errorMsg = response.data?.subscribe?.error || response.data?.subscribe?.message || 'Ошибка создания подписки'
        subscribeApiData.value.error = true
        subscribeApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка создания подписки'
      subscribeApiData.value.error = true
      subscribeApiData.value.message = errorMessage
      return null
    } finally {
      subscribeApiData.value.loading = false
    }
  }

  // Отписаться
  const unsubscribeAction = async (followingId: string): Promise<boolean> => {
    resetApiState(unsubscribeApiData.value)
    unsubscribeApiData.value.loading = true

    try {
      const response = await unsubscribe(followingId)

      if (response.data?.unsubscribe?.successfully) {
        unsubscribeApiData.value.data = true
        unsubscribeApiData.value.success = true
        unsubscribeApiData.value.message = response.data.unsubscribe.message || 'Подписка удалена'
        
        // Удаляем из списка подписок
        subscriptions.value = subscriptions.value.filter(s => s.followingId !== followingId)
        
        return true
      } else {
        const errorMsg = response.data?.unsubscribe?.error || response.data?.unsubscribe?.message || 'Ошибка удаления подписки'
        unsubscribeApiData.value.error = true
        unsubscribeApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления подписки'
      unsubscribeApiData.value.error = true
      unsubscribeApiData.value.message = errorMessage
      return false
    } finally {
      unsubscribeApiData.value.loading = false
    }
  }

  return {
    // State
    subscriptions,
    currentSubscription,
    subscribers,
    isSubscribedValue,
    
    // API States
    getSubscriptionsApiData,
    getSubscriptionApiData,
    getSubscribersApiData,
    isSubscribedApiData,
    subscribeApiData,
    unsubscribeApiData,
    
    // Getters
    subscriptionsGetters,
    currentSubscriptionGetters,
    subscribersGetters,
    isSubscribedGetters,
    
    // API Data Getters
    getSubscriptionsApiDataGetters,
    getSubscriptionApiDataGetters,
    getSubscribersApiDataGetters,
    isSubscribedApiDataGetters,
    subscribeApiDataGetters,
    unsubscribeApiDataGetters,
    
    // Actions
    fetchSubscriptions,
    fetchSubscription,
    fetchSubscribers,
    checkIsSubscribed,
    subscribeAction,
    unsubscribeAction
  }
})
