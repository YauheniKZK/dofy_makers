import client from '../index'
import { GET_POSTS, type GetPostsResult } from '../queries/get-posts'
import { GET_POST, type GetPostResult } from '../queries/get-post'
import { CREATE_POST, type CreatePostInput, type CreatePostResult } from '../mutations/create-post'
import { UPDATE_POST, type UpdatePostInput, type UpdatePostResult } from '../mutations/update-post'
import { DELETE_POST, type DeletePostResult } from '../mutations/delete-post'
import { ATTACH_TAGS_TO_POST, type AttachTagsToPostInput, type AttachTagsToPostResult } from '../mutations/attach-tags-to-post'
import { REMOVE_TAG_FROM_POST, type RemoveTagFromPostInput, type RemoveTagFromPostResult } from '../mutations/remove-tag-from-post'
import { INCREMENT_POST_LIKES, type IncrementPostLikesResult } from '../mutations/increment-post-likes'
import { DECREMENT_POST_LIKES, type DecrementPostLikesResult } from '../mutations/decrement-post-likes'
import { INCREMENT_POST_VIEWS, type IncrementPostViewsResult } from '../mutations/increment-post-views'

/**
 * Получить список постов
 */
export const getPosts = async (params?: { userId?: string; isPublished?: boolean; limit?: number; offset?: number }) => {
  return await client.query<GetPostsResult>({
    query: GET_POSTS,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить пост по ID
 */
export const getPost = async (id: string) => {
  return await client.query<GetPostResult>({
    query: GET_POST,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Создать пост
 */
export const createPost = async (input: CreatePostInput) => {
  return await client.mutate<CreatePostResult>({
    mutation: CREATE_POST,
    variables: { input }
  })
}

/**
 * Обновить пост
 */
export const updatePost = async (input: UpdatePostInput) => {
  return await client.mutate<UpdatePostResult>({
    mutation: UPDATE_POST,
    variables: { input }
  })
}

/**
 * Удалить пост
 */
export const deletePost = async (postId: string) => {
  return await client.mutate<DeletePostResult>({
    mutation: DELETE_POST,
    variables: { postId }
  })
}

/**
 * Прикрепить теги к посту
 */
export const attachTagsToPost = async (input: AttachTagsToPostInput) => {
  return await client.mutate<AttachTagsToPostResult>({
    mutation: ATTACH_TAGS_TO_POST,
    variables: { input }
  })
}

/**
 * Удалить тег из поста
 */
export const removeTagFromPost = async (input: RemoveTagFromPostInput) => {
  return await client.mutate<RemoveTagFromPostResult>({
    mutation: REMOVE_TAG_FROM_POST,
    variables: { input }
  })
}

/**
 * Увеличить количество лайков поста
 */
export const incrementPostLikes = async (postId: string) => {
  return await client.mutate<IncrementPostLikesResult>({
    mutation: INCREMENT_POST_LIKES,
    variables: { postId }
  })
}

/**
 * Уменьшить количество лайков поста
 */
export const decrementPostLikes = async (postId: string) => {
  return await client.mutate<DecrementPostLikesResult>({
    mutation: DECREMENT_POST_LIKES,
    variables: { postId }
  })
}

/**
 * Увеличить количество просмотров поста
 */
export const incrementPostViews = async (postId: string) => {
  return await client.mutate<IncrementPostViewsResult>({
    mutation: INCREMENT_POST_VIEWS,
    variables: { postId }
  })
}
