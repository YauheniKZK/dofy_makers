import client from '../index'
import { GET_FAVORITES, type GetFavoritesResult } from '../queries/get-favorites'
import { GET_FAVORITE_COUNT, type GetFavoriteCountResult } from '../queries/get-favorite-count'
import { GET_USER_FAVORITES, type GetUserFavoritesResult } from '../queries/get-user-favorites'
import { IS_FAVORITE, type IsFavoriteResult } from '../queries/is-favorite'
import { ADD_TO_FAVORITES, type AddToFavoritesInput, type AddToFavoritesResult } from '../mutations/add-to-favorites'
import { REMOVE_FROM_FAVORITES, type RemoveFromFavoritesResult } from '../mutations/remove-from-favorites'

/**
 * Получить список пользователей, добавивших объект в избранное
 */
export const getFavorites = async (favoriteableType: string, favoriteableId: string, params?: { limit?: number; offset?: number }) => {
  return await client.query<GetFavoritesResult>({
    query: GET_FAVORITES,
    variables: { favoriteableType, favoriteableId, ...params },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить количество пользователей, добавивших объект в избранное
 */
export const getFavoriteCount = async (favoriteableType: string, favoriteableId: string) => {
  return await client.query<GetFavoriteCountResult>({
    query: GET_FAVORITE_COUNT,
    variables: { favoriteableType, favoriteableId },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить избранное пользователя
 */
export const getUserFavorites = async (userId?: string, favoriteableType?: string, params?: { limit?: number; offset?: number }) => {
  return await client.query<GetUserFavoritesResult>({
    query: GET_USER_FAVORITES,
    variables: { userId, favoriteableType, ...params },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Проверить, добавлен ли объект в избранное
 */
export const isFavorite = async (favoriteableType: string, favoriteableId: string, userId?: string) => {
  return await client.query<IsFavoriteResult>({
    query: IS_FAVORITE,
    variables: { userId, favoriteableType, favoriteableId },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Добавить в избранное
 */
export const addToFavorites = async (input: AddToFavoritesInput) => {
  return await client.mutate<AddToFavoritesResult>({
    mutation: ADD_TO_FAVORITES,
    variables: { input }
  })
}

/**
 * Удалить из избранного
 */
export const removeFromFavorites = async (favoriteableType: string, favoriteableId: string) => {
  return await client.mutate<RemoveFromFavoritesResult>({
    mutation: REMOVE_FROM_FAVORITES,
    variables: { favoriteableType, favoriteableId }
  })
}
