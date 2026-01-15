import client from '../index'
import { GET_TAGS, type GetTagsResult } from '../queries/get-tags'
import { GET_TAG, type GetTagResult } from '../queries/get-tag'
import { GET_TAG_SUGGESTIONS, type GetTagSuggestionsResult } from '../queries/get-tag-suggestions'
import { CREATE_TAG, type CreateTagInput, type CreateTagResult } from '../mutations/create-tag'

/**
 * Получить список тегов
 */
export const getTags = async (params?: { type?: string; search?: string; limit?: number }) => {
  return await client.query<GetTagsResult>({
    query: GET_TAGS,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить тег по ID
 */
export const getTag = async (id: string) => {
  return await client.query<GetTagResult>({
    query: GET_TAG,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить предложения тегов
 */
export const getTagSuggestions = async (query: string, type?: string, limit?: number) => {
  return await client.query<GetTagSuggestionsResult>({
    query: GET_TAG_SUGGESTIONS,
    variables: { query, type, limit },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Создать тег
 */
export const createTag = async (input: CreateTagInput) => {
  return await client.mutate<CreateTagResult>({
    mutation: CREATE_TAG,
    variables: { input }
  })
}
