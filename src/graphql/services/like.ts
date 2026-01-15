import client from '../index'
import { GET_LIKES, type GetLikesResult } from '../queries/get-likes'
import { GET_LIKE_COUNT, type GetLikeCountResult } from '../queries/get-like-count'
import { GET_USER_LIKES, type GetUserLikesResult } from '../queries/get-user-likes'
import { IS_LIKED, type IsLikedResult } from '../queries/is-liked'
import { LIKE, type LikeInput, type LikeResult } from '../mutations/like'
import { UNLIKE, type UnlikeResult } from '../mutations/unlike'

/**
 * Получить список лайков
 */
export const getLikes = async (likeableType: string, likeableId: string, params?: { limit?: number; offset?: number }) => {
  return await client.query<GetLikesResult>({
    query: GET_LIKES,
    variables: { likeableType, likeableId, ...params },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить количество лайков
 */
export const getLikeCount = async (likeableType: string, likeableId: string) => {
  return await client.query<GetLikeCountResult>({
    query: GET_LIKE_COUNT,
    variables: { likeableType, likeableId },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить лайки пользователя
 */
export const getUserLikes = async (userId: string, likeableType?: string) => {
  return await client.query<GetUserLikesResult>({
    query: GET_USER_LIKES,
    variables: { userId, likeableType },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Проверить, лайкнул ли пользователь
 */
export const isLiked = async (userId: string, likeableType: string, likeableId: string) => {
  return await client.query<IsLikedResult>({
    query: IS_LIKED,
    variables: { userId, likeableType, likeableId },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Поставить лайк
 */
export const like = async (input: LikeInput) => {
  return await client.mutate<LikeResult>({
    mutation: LIKE,
    variables: { input }
  })
}

/**
 * Убрать лайк
 */
export const unlike = async (likeableType: string, likeableId: string) => {
  return await client.mutate<UnlikeResult>({
    mutation: UNLIKE,
    variables: { likeableType, likeableId }
  })
}
