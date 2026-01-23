import client from '../index'
import {
  GET_RECOMMENDATION_COLLECTIONS,
  type GetRecommendationCollectionsResult,
  type RecommendationCollectionType
} from '../queries/get-recommendation-collections'
import {
  GET_RECOMMENDATION_COLLECTION,
  type GetRecommendationCollectionResult
} from '../queries/get-recommendation-collection'
import {
  GET_RECOMMENDATION_ITEMS,
  type GetRecommendationItemsResult
} from '../queries/get-recommendation-items'
import {
  CREATE_RECOMMENDATION_COLLECTION,
  type CreateRecommendationCollectionInput,
  type CreateRecommendationCollectionResult
} from '../mutations/create-recommendation-collection'
import {
  UPDATE_RECOMMENDATION_COLLECTION,
  type UpdateRecommendationCollectionInput,
  type UpdateRecommendationCollectionResult
} from '../mutations/update-recommendation-collection'
import {
  DELETE_RECOMMENDATION_COLLECTION,
  type DeleteRecommendationCollectionResult
} from '../mutations/delete-recommendation-collection'
import {
  ADD_ITEM_TO_COLLECTION,
  type AddItemToCollectionInput,
  type AddItemToCollectionResult
} from '../mutations/add-item-to-collection'
import {
  REMOVE_ITEM_FROM_COLLECTION,
  type RemoveItemFromCollectionResult
} from '../mutations/remove-item-from-collection'
import {
  UPDATE_ITEM_ORDER,
  type UpdateItemOrderInput,
  type UpdateItemOrderResult
} from '../mutations/update-item-order'
import {
  REORDER_COLLECTION_ITEMS,
  type ReorderCollectionItemsInput,
  type ReorderCollectionItemsResult
} from '../mutations/reorder-collection-items'
import {
  GET_AUTO_RECOMMENDATIONS,
  type GetAutoRecommendationsResult
} from '../queries/get-auto-recommendations'
import { RecommendationItemType } from '../queries/get-recommendation-collections'

/**
 * Получить автоматические рекомендации
 */
export const getAutoRecommendations = async (params?: {
  itemType?: RecommendationItemType
  limit?: number
  offset?: number
}) => {
  return await client.query<GetAutoRecommendationsResult>({
    query: GET_AUTO_RECOMMENDATIONS,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить список коллекций рекомендаций
 */
export const getRecommendationCollections = async (params?: {
  collectionType?: RecommendationCollectionType
  isActive?: boolean
  limit?: number
  offset?: number
}) => {
  return await client.query<GetRecommendationCollectionsResult>({
    query: GET_RECOMMENDATION_COLLECTIONS,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить коллекцию рекомендаций по ID
 */
export const getRecommendationCollection = async (id: string) => {
  return await client.query<GetRecommendationCollectionResult>({
    query: GET_RECOMMENDATION_COLLECTION,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить элементы коллекции рекомендаций
 */
export const getRecommendationItems = async (params: {
  collectionId: string
  limit?: number
  offset?: number
}) => {
  return await client.query<GetRecommendationItemsResult>({
    query: GET_RECOMMENDATION_ITEMS,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Создать коллекцию рекомендаций
 */
export const createRecommendationCollection = async (input: CreateRecommendationCollectionInput) => {
  return await client.mutate<CreateRecommendationCollectionResult>({
    mutation: CREATE_RECOMMENDATION_COLLECTION,
    variables: { input }
  })
}

/**
 * Обновить коллекцию рекомендаций
 */
export const updateRecommendationCollection = async (input: UpdateRecommendationCollectionInput) => {
  return await client.mutate<UpdateRecommendationCollectionResult>({
    mutation: UPDATE_RECOMMENDATION_COLLECTION,
    variables: { input }
  })
}

/**
 * Удалить коллекцию рекомендаций
 */
export const deleteRecommendationCollection = async (collectionId: string) => {
  return await client.mutate<DeleteRecommendationCollectionResult>({
    mutation: DELETE_RECOMMENDATION_COLLECTION,
    variables: { collectionId }
  })
}

/**
 * Добавить элемент в коллекцию
 */
export const addItemToCollection = async (input: AddItemToCollectionInput) => {
  return await client.mutate<AddItemToCollectionResult>({
    mutation: ADD_ITEM_TO_COLLECTION,
    variables: { input }
  })
}

/**
 * Удалить элемент из коллекции
 */
export const removeItemFromCollection = async (itemId: string) => {
  return await client.mutate<RemoveItemFromCollectionResult>({
    mutation: REMOVE_ITEM_FROM_COLLECTION,
    variables: { itemId }
  })
}

/**
 * Изменить порядок элемента
 */
export const updateItemOrder = async (input: UpdateItemOrderInput) => {
  return await client.mutate<UpdateItemOrderResult>({
    mutation: UPDATE_ITEM_ORDER,
    variables: { input }
  })
}

/**
 * Массовое изменение порядка элементов
 */
export const reorderCollectionItems = async (input: ReorderCollectionItemsInput) => {
  return await client.mutate<ReorderCollectionItemsResult>({
    mutation: REORDER_COLLECTION_ITEMS,
    variables: { input }
  })
}
