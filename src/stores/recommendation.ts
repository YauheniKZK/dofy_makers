import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getAutoRecommendations,
  getRecommendationCollections,
  getRecommendationCollection,
  getRecommendationItems,
  createRecommendationCollection,
  updateRecommendationCollection,
  deleteRecommendationCollection,
  addItemToCollection,
  removeItemFromCollection,
  updateItemOrder,
  reorderCollectionItems
} from '@/graphql/services/recommendation'
import type { RecommendationCollection, RecommendationCollectionType, RecommendationItem, RecommendationItemType } from '@/graphql/queries/get-recommendation-collections'
import type { AutoRecommendationsData } from '@/graphql/queries/get-auto-recommendations'
import type { CreateRecommendationCollectionInput } from '@/graphql/mutations/create-recommendation-collection'
import type { UpdateRecommendationCollectionInput } from '@/graphql/mutations/update-recommendation-collection'
import type { AddItemToCollectionInput } from '@/graphql/mutations/add-item-to-collection'
import type { UpdateItemOrderInput } from '@/graphql/mutations/update-item-order'
import type { ReorderCollectionItemsInput } from '@/graphql/mutations/reorder-collection-items'

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

export const useRecommendationStore = defineStore('recommendation', () => {
  // -----------------STATE---------------------
  const collections = ref<RecommendationCollection[]>([])
  const currentCollection = ref<RecommendationCollection | null>(null)
  const items = ref<RecommendationItem[]>([])
  const autoRecommendations = ref<AutoRecommendationsData | null>(null)

  // Состояния для каждого API запроса
  const getRecommendationCollectionsApiData = ref<ApiState<{ collections: RecommendationCollection[]; total: number }>>(
    createDefaultApiState<{ collections: RecommendationCollection[]; total: number }>()
  )
  const getRecommendationCollectionApiData = ref<ApiState<RecommendationCollection>>(
    createDefaultApiState<RecommendationCollection>()
  )
  const getRecommendationItemsApiData = ref<ApiState<{ items: RecommendationItem[]; total: number }>>(
    createDefaultApiState<{ items: RecommendationItem[]; total: number }>()
  )
  const createRecommendationCollectionApiData = ref<ApiState<RecommendationCollection>>(
    createDefaultApiState<RecommendationCollection>()
  )
  const updateRecommendationCollectionApiData = ref<ApiState<RecommendationCollection>>(
    createDefaultApiState<RecommendationCollection>()
  )
  const deleteRecommendationCollectionApiData = ref<ApiState<boolean>>(
    createDefaultApiState<boolean>()
  )
  const addItemToCollectionApiData = ref<ApiState<RecommendationItem>>(
    createDefaultApiState<RecommendationItem>()
  )
  const removeItemFromCollectionApiData = ref<ApiState<boolean>>(
    createDefaultApiState<boolean>()
  )
  const updateItemOrderApiData = ref<ApiState<RecommendationItem>>(
    createDefaultApiState<RecommendationItem>()
  )
  const reorderCollectionItemsApiData = ref<ApiState<RecommendationCollection>>(
    createDefaultApiState<RecommendationCollection>()
  )
  const getAutoRecommendationsApiData = ref<ApiState<AutoRecommendationsData>>(
    createDefaultApiState<AutoRecommendationsData>()
  )

  // -----------------GETTERS---------------------
  const collectionsGetters = computed(() => collections.value)
  const currentCollectionGetters = computed(() => currentCollection.value)
  const itemsGetters = computed(() => items.value)
  const autoRecommendationsGetters = computed(() => autoRecommendations.value)

  // Геттеры для API состояний
  const getRecommendationCollectionsApiDataGetters = computed(() => getRecommendationCollectionsApiData.value)
  const getRecommendationCollectionApiDataGetters = computed(() => getRecommendationCollectionApiData.value)
  const getRecommendationItemsApiDataGetters = computed(() => getRecommendationItemsApiData.value)
  const createRecommendationCollectionApiDataGetters = computed(() => createRecommendationCollectionApiData.value)
  const updateRecommendationCollectionApiDataGetters = computed(() => updateRecommendationCollectionApiData.value)
  const deleteRecommendationCollectionApiDataGetters = computed(() => deleteRecommendationCollectionApiData.value)
  const addItemToCollectionApiDataGetters = computed(() => addItemToCollectionApiData.value)
  const removeItemFromCollectionApiDataGetters = computed(() => removeItemFromCollectionApiData.value)
  const updateItemOrderApiDataGetters = computed(() => updateItemOrderApiData.value)
  const reorderCollectionItemsApiDataGetters = computed(() => reorderCollectionItemsApiData.value)
  const getAutoRecommendationsApiDataGetters = computed(() => getAutoRecommendationsApiData.value)

  // -----------------ACTIONS---------------------

  // Получить автоматические рекомендации
  const fetchAutoRecommendations = async (params?: {
    itemType?: RecommendationItemType
    limit?: number
    offset?: number
  }): Promise<void> => {
    resetApiState(getAutoRecommendationsApiData.value)
    getAutoRecommendationsApiData.value.loading = true

    try {
      const response = await getAutoRecommendations(params)

      if (response.data?.autoRecommendations?.successfully && response.data.autoRecommendations.data) {
        const data = response.data.autoRecommendations.data
        autoRecommendations.value = data
        getAutoRecommendationsApiData.value.data = data
        getAutoRecommendationsApiData.value.success = true
        getAutoRecommendationsApiData.value.message = response.data.autoRecommendations.message || 'Автоматические рекомендации загружены'
      } else {
        const errorMsg = response.data?.autoRecommendations?.error || response.data?.autoRecommendations?.message || 'Ошибка загрузки автоматических рекомендаций'
        getAutoRecommendationsApiData.value.error = true
        getAutoRecommendationsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки автоматических рекомендаций'
      getAutoRecommendationsApiData.value.error = true
      getAutoRecommendationsApiData.value.message = errorMessage
    } finally {
      getAutoRecommendationsApiData.value.loading = false
    }
  }

  // Получить список коллекций рекомендаций
  const fetchRecommendationCollections = async (params?: {
    collectionType?: RecommendationCollectionType
    isActive?: boolean
    limit?: number
    offset?: number
  }): Promise<void> => {
    resetApiState(getRecommendationCollectionsApiData.value)
    getRecommendationCollectionsApiData.value.loading = true

    try {
      const response = await getRecommendationCollections(params)

      if (response.data?.recommendationCollections?.successfully && response.data.recommendationCollections.data) {
        const data = response.data.recommendationCollections.data
        collections.value = data.collections
        getRecommendationCollectionsApiData.value.data = data
        getRecommendationCollectionsApiData.value.success = true
        getRecommendationCollectionsApiData.value.message = response.data.recommendationCollections.message || 'Коллекции загружены'
      } else {
        const errorMsg = response.data?.recommendationCollections?.error || response.data?.recommendationCollections?.message || 'Ошибка загрузки коллекций'
        getRecommendationCollectionsApiData.value.error = true
        getRecommendationCollectionsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки коллекций'
      getRecommendationCollectionsApiData.value.error = true
      getRecommendationCollectionsApiData.value.message = errorMessage
    } finally {
      getRecommendationCollectionsApiData.value.loading = false
    }
  }

  // Получить коллекцию рекомендаций по ID
  const fetchRecommendationCollection = async (id: string): Promise<RecommendationCollection | null> => {
    resetApiState(getRecommendationCollectionApiData.value)
    getRecommendationCollectionApiData.value.loading = true

    try {
      const response = await getRecommendationCollection(id)

      if (response.data?.recommendationCollection?.successfully && response.data.recommendationCollection.data) {
        const collection = response.data.recommendationCollection.data
        currentCollection.value = collection
        getRecommendationCollectionApiData.value.data = collection
        getRecommendationCollectionApiData.value.success = true
        getRecommendationCollectionApiData.value.message = response.data.recommendationCollection.message || 'Коллекция загружена'
        return collection
      } else {
        const errorMsg = response.data?.recommendationCollection?.error || response.data?.recommendationCollection?.message || 'Коллекция не найдена'
        getRecommendationCollectionApiData.value.error = true
        getRecommendationCollectionApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки коллекции'
      getRecommendationCollectionApiData.value.error = true
      getRecommendationCollectionApiData.value.message = errorMessage
      return null
    } finally {
      getRecommendationCollectionApiData.value.loading = false
    }
  }

  // Получить элементы коллекции рекомендаций
  const fetchRecommendationItems = async (params: {
    collectionId: string
    limit?: number
    offset?: number
  }): Promise<void> => {
    resetApiState(getRecommendationItemsApiData.value)
    getRecommendationItemsApiData.value.loading = true

    try {
      const response = await getRecommendationItems(params)

      if (response.data?.recommendationItems?.successfully && response.data.recommendationItems.data) {
        const data = response.data.recommendationItems.data
        items.value = data.items
        getRecommendationItemsApiData.value.data = data
        getRecommendationItemsApiData.value.success = true
        getRecommendationItemsApiData.value.message = response.data.recommendationItems.message || 'Элементы загружены'
      } else {
        const errorMsg = response.data?.recommendationItems?.error || response.data?.recommendationItems?.message || 'Ошибка загрузки элементов'
        getRecommendationItemsApiData.value.error = true
        getRecommendationItemsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки элементов'
      getRecommendationItemsApiData.value.error = true
      getRecommendationItemsApiData.value.message = errorMessage
    } finally {
      getRecommendationItemsApiData.value.loading = false
    }
  }

  // Создать коллекцию рекомендаций
  const createRecommendationCollectionAction = async (input: CreateRecommendationCollectionInput): Promise<RecommendationCollection | null> => {
    resetApiState(createRecommendationCollectionApiData.value)
    createRecommendationCollectionApiData.value.loading = true

    try {
      const response = await createRecommendationCollection(input)

      if (response.data?.createRecommendationCollection?.successfully && response.data.createRecommendationCollection.data) {
        const collection = response.data.createRecommendationCollection.data as any
        createRecommendationCollectionApiData.value.data = collection
        createRecommendationCollectionApiData.value.success = true
        createRecommendationCollectionApiData.value.message = response.data.createRecommendationCollection.message || 'Коллекция создана'
        
        // Добавляем в список коллекций
        collections.value.unshift(collection)
        
        return collection
      } else {
        const errorMsg = response.data?.createRecommendationCollection?.error || response.data?.createRecommendationCollection?.message || 'Ошибка создания коллекции'
        createRecommendationCollectionApiData.value.error = true
        createRecommendationCollectionApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка создания коллекции'
      createRecommendationCollectionApiData.value.error = true
      createRecommendationCollectionApiData.value.message = errorMessage
      return null
    } finally {
      createRecommendationCollectionApiData.value.loading = false
    }
  }

  // Обновить коллекцию рекомендаций
  const updateRecommendationCollectionAction = async (input: UpdateRecommendationCollectionInput): Promise<RecommendationCollection | null> => {
    resetApiState(updateRecommendationCollectionApiData.value)
    updateRecommendationCollectionApiData.value.loading = true

    try {
      const response = await updateRecommendationCollection(input)

      if (response.data?.updateRecommendationCollection?.successfully && response.data.updateRecommendationCollection.data) {
        const updatedCollection = response.data.updateRecommendationCollection.data as any
        updateRecommendationCollectionApiData.value.data = updatedCollection
        updateRecommendationCollectionApiData.value.success = true
        updateRecommendationCollectionApiData.value.message = response.data.updateRecommendationCollection.message || 'Коллекция обновлена'
        
        // Обновляем в списке коллекций
        const index = collections.value.findIndex(c => c.id === input.collectionId)
        if (index !== -1) {
          collections.value[index] = { ...collections.value[index], ...updatedCollection }
        }
        
        // Обновляем текущую коллекцию
        if (currentCollection.value?.id === input.collectionId) {
          currentCollection.value = { ...currentCollection.value, ...updatedCollection }
        }
        
        return updatedCollection
      } else {
        const errorMsg = response.data?.updateRecommendationCollection?.error || response.data?.updateRecommendationCollection?.message || 'Ошибка обновления коллекции'
        updateRecommendationCollectionApiData.value.error = true
        updateRecommendationCollectionApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка обновления коллекции'
      updateRecommendationCollectionApiData.value.error = true
      updateRecommendationCollectionApiData.value.message = errorMessage
      return null
    } finally {
      updateRecommendationCollectionApiData.value.loading = false
    }
  }

  // Удалить коллекцию рекомендаций
  const deleteRecommendationCollectionAction = async (collectionId: string): Promise<boolean> => {
    resetApiState(deleteRecommendationCollectionApiData.value)
    deleteRecommendationCollectionApiData.value.loading = true

    try {
      const response = await deleteRecommendationCollection(collectionId)

      if (response.data?.deleteRecommendationCollection?.successfully) {
        deleteRecommendationCollectionApiData.value.data = true
        deleteRecommendationCollectionApiData.value.success = true
        deleteRecommendationCollectionApiData.value.message = response.data.deleteRecommendationCollection.message || 'Коллекция удалена'
        
        // Удаляем из списка коллекций
        collections.value = collections.value.filter(c => c.id !== collectionId)
        
        // Очищаем текущую коллекцию, если это она
        if (currentCollection.value?.id === collectionId) {
          currentCollection.value = null
        }
        
        return true
      } else {
        const errorMsg = response.data?.deleteRecommendationCollection?.error || response.data?.deleteRecommendationCollection?.message || 'Ошибка удаления коллекции'
        deleteRecommendationCollectionApiData.value.error = true
        deleteRecommendationCollectionApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления коллекции'
      deleteRecommendationCollectionApiData.value.error = true
      deleteRecommendationCollectionApiData.value.message = errorMessage
      return false
    } finally {
      deleteRecommendationCollectionApiData.value.loading = false
    }
  }

  // Добавить элемент в коллекцию
  const addItemToCollectionAction = async (input: AddItemToCollectionInput): Promise<RecommendationItem | null> => {
    resetApiState(addItemToCollectionApiData.value)
    addItemToCollectionApiData.value.loading = true

    try {
      const response = await addItemToCollection(input)

      if (response.data?.addItemToCollection?.successfully && response.data.addItemToCollection.data) {
        const item = response.data.addItemToCollection.data as any
        addItemToCollectionApiData.value.data = item
        addItemToCollectionApiData.value.success = true
        addItemToCollectionApiData.value.message = response.data.addItemToCollection.message || 'Элемент добавлен'
        
        // Добавляем в список элементов
        items.value.push(item)
        
        // Обновляем коллекцию в списке
        const collectionIndex = collections.value.findIndex(c => c.id === input.collectionId)
        if (collectionIndex !== -1) {
          collections.value[collectionIndex].items.push(item)
        }
        
        // Обновляем текущую коллекцию
        if (currentCollection.value?.id === input.collectionId) {
          currentCollection.value.items.push(item)
        }
        
        return item
      } else {
        const errorMsg = response.data?.addItemToCollection?.error || response.data?.addItemToCollection?.message || 'Ошибка добавления элемента'
        addItemToCollectionApiData.value.error = true
        addItemToCollectionApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка добавления элемента'
      addItemToCollectionApiData.value.error = true
      addItemToCollectionApiData.value.message = errorMessage
      return null
    } finally {
      addItemToCollectionApiData.value.loading = false
    }
  }

  // Удалить элемент из коллекции
  const removeItemFromCollectionAction = async (itemId: string): Promise<boolean> => {
    resetApiState(removeItemFromCollectionApiData.value)
    removeItemFromCollectionApiData.value.loading = true

    try {
      const response = await removeItemFromCollection(itemId)

      if (response.data?.removeItemFromCollection?.successfully) {
        removeItemFromCollectionApiData.value.data = true
        removeItemFromCollectionApiData.value.success = true
        removeItemFromCollectionApiData.value.message = response.data.removeItemFromCollection.message || 'Элемент удален'
        
        // Удаляем из списка элементов
        const item = items.value.find(i => i.id === itemId)
        if (item) {
          items.value = items.value.filter(i => i.id !== itemId)
          
          // Обновляем коллекцию в списке
          const collectionIndex = collections.value.findIndex(c => c.items.some(i => i.id === itemId))
          if (collectionIndex !== -1) {
            collections.value[collectionIndex].items = collections.value[collectionIndex].items.filter(i => i.id !== itemId)
          }
          
          // Обновляем текущую коллекцию
          if (currentCollection.value) {
            currentCollection.value.items = currentCollection.value.items.filter(i => i.id !== itemId)
          }
        }
        
        return true
      } else {
        const errorMsg = response.data?.removeItemFromCollection?.error || response.data?.removeItemFromCollection?.message || 'Ошибка удаления элемента'
        removeItemFromCollectionApiData.value.error = true
        removeItemFromCollectionApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления элемента'
      removeItemFromCollectionApiData.value.error = true
      removeItemFromCollectionApiData.value.message = errorMessage
      return false
    } finally {
      removeItemFromCollectionApiData.value.loading = false
    }
  }

  // Изменить порядок элемента
  const updateItemOrderAction = async (input: UpdateItemOrderInput): Promise<RecommendationItem | null> => {
    resetApiState(updateItemOrderApiData.value)
    updateItemOrderApiData.value.loading = true

    try {
      const response = await updateItemOrder(input)

      if (response.data?.updateItemOrder?.successfully && response.data.updateItemOrder.data) {
        const updatedItem = response.data.updateItemOrder.data as any
        updateItemOrderApiData.value.data = updatedItem
        updateItemOrderApiData.value.success = true
        updateItemOrderApiData.value.message = response.data.updateItemOrder.message || 'Порядок обновлен'
        
        // Обновляем элемент в списке
        const itemIndex = items.value.findIndex(i => i.id === input.itemId)
        if (itemIndex !== -1) {
          items.value[itemIndex] = { ...items.value[itemIndex], ...updatedItem }
        }
        
        // Обновляем в коллекциях
        for (const collection of collections.value) {
          const itemIndex = collection.items.findIndex(i => i.id === input.itemId)
          if (itemIndex !== -1) {
            collection.items[itemIndex] = { ...collection.items[itemIndex], ...updatedItem }
          }
        }
        
        // Обновляем текущую коллекцию
        if (currentCollection.value) {
          const itemIndex = currentCollection.value.items.findIndex(i => i.id === input.itemId)
          if (itemIndex !== -1) {
            currentCollection.value.items[itemIndex] = { ...currentCollection.value.items[itemIndex], ...updatedItem }
          }
        }
        
        return updatedItem
      } else {
        const errorMsg = response.data?.updateItemOrder?.error || response.data?.updateItemOrder?.message || 'Ошибка обновления порядка'
        updateItemOrderApiData.value.error = true
        updateItemOrderApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка обновления порядка'
      updateItemOrderApiData.value.error = true
      updateItemOrderApiData.value.message = errorMessage
      return null
    } finally {
      updateItemOrderApiData.value.loading = false
    }
  }

  // Массовое изменение порядка элементов
  const reorderCollectionItemsAction = async (input: ReorderCollectionItemsInput): Promise<RecommendationCollection | null> => {
    resetApiState(reorderCollectionItemsApiData.value)
    reorderCollectionItemsApiData.value.loading = true

    try {
      const response = await reorderCollectionItems(input)

      if (response.data?.reorderCollectionItems?.successfully && response.data.reorderCollectionItems.data) {
        const updatedCollection = response.data.reorderCollectionItems.data as any
        reorderCollectionItemsApiData.value.data = updatedCollection
        reorderCollectionItemsApiData.value.success = true
        reorderCollectionItemsApiData.value.message = response.data.reorderCollectionItems.message || 'Порядок элементов обновлен'
        
        // Обновляем коллекцию в списке
        const index = collections.value.findIndex(c => c.id === input.collectionId)
        if (index !== -1) {
          collections.value[index] = { ...collections.value[index], ...updatedCollection }
        }
        
        // Обновляем текущую коллекцию
        if (currentCollection.value?.id === input.collectionId) {
          currentCollection.value = { ...currentCollection.value, ...updatedCollection }
        }
        
        return updatedCollection
      } else {
        const errorMsg = response.data?.reorderCollectionItems?.error || response.data?.reorderCollectionItems?.message || 'Ошибка изменения порядка элементов'
        reorderCollectionItemsApiData.value.error = true
        reorderCollectionItemsApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка изменения порядка элементов'
      reorderCollectionItemsApiData.value.error = true
      reorderCollectionItemsApiData.value.message = errorMessage
      return null
    } finally {
      reorderCollectionItemsApiData.value.loading = false
    }
  }

  return {
    // State
    collections,
    currentCollection,
    items,
    autoRecommendations,
    
    // API States
    getRecommendationCollectionsApiData,
    getRecommendationCollectionApiData,
    getRecommendationItemsApiData,
    createRecommendationCollectionApiData,
    updateRecommendationCollectionApiData,
    deleteRecommendationCollectionApiData,
    addItemToCollectionApiData,
    removeItemFromCollectionApiData,
    updateItemOrderApiData,
    reorderCollectionItemsApiData,
    getAutoRecommendationsApiData,
    
    // Getters
    collectionsGetters,
    currentCollectionGetters,
    itemsGetters,
    autoRecommendationsGetters,
    
    // API Data Getters
    getRecommendationCollectionsApiDataGetters,
    getRecommendationCollectionApiDataGetters,
    getRecommendationItemsApiDataGetters,
    createRecommendationCollectionApiDataGetters,
    updateRecommendationCollectionApiDataGetters,
    deleteRecommendationCollectionApiDataGetters,
    addItemToCollectionApiDataGetters,
    removeItemFromCollectionApiDataGetters,
    updateItemOrderApiDataGetters,
    reorderCollectionItemsApiDataGetters,
    getAutoRecommendationsApiDataGetters,
    
    // Actions
    fetchAutoRecommendations,
    fetchRecommendationCollections,
    fetchRecommendationCollection,
    fetchRecommendationItems,
    createRecommendationCollectionAction,
    updateRecommendationCollectionAction,
    deleteRecommendationCollectionAction,
    addItemToCollectionAction,
    removeItemFromCollectionAction,
    updateItemOrderAction,
    reorderCollectionItemsAction
  }
})
