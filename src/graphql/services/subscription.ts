import client from '../index'
import { GET_SUBSCRIPTIONS, type GetSubscriptionsResult } from '../queries/get-subscriptions'
import { GET_SUBSCRIPTION, type GetSubscriptionResult } from '../queries/get-subscription'
import { GET_SUBSCRIBERS, type GetSubscribersResult } from '../queries/get-subscribers'
import { IS_SUBSCRIBED, type IsSubscribedResult } from '../queries/is-subscribed'
import { SUBSCRIBE, type SubscribeInput, type SubscribeResult } from '../mutations/subscribe'
import { UNSUBSCRIBE, type UnsubscribeResult } from '../mutations/unsubscribe'

/**
 * Получить список подписок
 */
export const getSubscriptions = async (userId: string, params?: { limit?: number; offset?: number }) => {
  return await client.query<GetSubscriptionsResult>({
    query: GET_SUBSCRIPTIONS,
    variables: { userId, ...params },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить подписку по ID
 */
export const getSubscription = async (id: string) => {
  return await client.query<GetSubscriptionResult>({
    query: GET_SUBSCRIPTION,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить список подписчиков
 */
export const getSubscribers = async (userId: string, params?: { limit?: number; offset?: number }) => {
  return await client.query<GetSubscribersResult>({
    query: GET_SUBSCRIBERS,
    variables: { userId, ...params },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Проверить, подписан ли пользователь
 */
export const isSubscribed = async (followerId: string, followingId: string) => {
  return await client.query<IsSubscribedResult>({
    query: IS_SUBSCRIBED,
    variables: { followerId, followingId },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Подписаться
 */
export const subscribe = async (input: SubscribeInput) => {
  return await client.mutate<SubscribeResult>({
    mutation: SUBSCRIBE,
    variables: { input }
  })
}

/**
 * Отписаться
 */
export const unsubscribe = async (followingId: string) => {
  return await client.mutate<UnsubscribeResult>({
    mutation: UNSUBSCRIBE,
    variables: { followingId }
  })
}
