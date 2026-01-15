import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getTags,
  getTag,
  getTagSuggestions,
  createTag
} from '@/graphql/services/tag'
import type { Tag } from '@/graphql/queries/get-tags'
import type { TagSuggestion } from '@/graphql/queries/get-tag-suggestions'
import type { CreateTagInput } from '@/graphql/mutations/create-tag'

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

export const useTagStore = defineStore('tag', () => {
  // -----------------STATE---------------------
  const tags = ref<Tag[]>([])
  const currentTag = ref<Tag | null>(null)
  const tagSuggestions = ref<TagSuggestion[]>([])

  // Состояния для каждого API запроса
  const getTagsApiData = ref<ApiState<Tag[]>>(createDefaultApiState<Tag[]>())
  const getTagApiData = ref<ApiState<Tag>>(createDefaultApiState<Tag>())
  const getTagSuggestionsApiData = ref<ApiState<TagSuggestion[]>>(createDefaultApiState<TagSuggestion[]>())
  const createTagApiData = ref<ApiState<Tag>>(createDefaultApiState<Tag>())

  // -----------------GETTERS---------------------
  const tagsGetters = computed(() => tags.value)
  const currentTagGetters = computed(() => currentTag.value)
  const tagSuggestionsGetters = computed(() => tagSuggestions.value)

  // Геттеры для API состояний
  const getTagsApiDataGetters = computed(() => getTagsApiData.value)
  const getTagApiDataGetters = computed(() => getTagApiData.value)
  const getTagSuggestionsApiDataGetters = computed(() => getTagSuggestionsApiData.value)
  const createTagApiDataGetters = computed(() => createTagApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список тегов
  const fetchTags = async (params?: { type?: string; search?: string; limit?: number }): Promise<void> => {
    resetApiState(getTagsApiData.value)
    getTagsApiData.value.loading = true

    try {
      const response = await getTags(params)

      if (response.data?.tags?.successfully && response.data.tags.data) {
        const data = response.data.tags.data
        tags.value = data
        getTagsApiData.value.data = data
        getTagsApiData.value.success = true
        getTagsApiData.value.message = response.data.tags.message || 'Теги загружены'
      } else {
        const errorMsg = response.data?.tags?.error || response.data?.tags?.message || 'Ошибка загрузки тегов'
        getTagsApiData.value.error = true
        getTagsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки тегов'
      getTagsApiData.value.error = true
      getTagsApiData.value.message = errorMessage
    } finally {
      getTagsApiData.value.loading = false
    }
  }

  // Получить тег по ID
  const fetchTag = async (id: string): Promise<Tag | null> => {
    resetApiState(getTagApiData.value)
    getTagApiData.value.loading = true

    try {
      const response = await getTag(id)

      if (response.data?.tag?.successfully && response.data.tag.data) {
        const tag = response.data.tag.data
        currentTag.value = tag
        getTagApiData.value.data = tag
        getTagApiData.value.success = true
        getTagApiData.value.message = response.data.tag.message || 'Тег загружен'
        return tag
      } else {
        const errorMsg = response.data?.tag?.error || response.data?.tag?.message || 'Тег не найден'
        getTagApiData.value.error = true
        getTagApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки тега'
      getTagApiData.value.error = true
      getTagApiData.value.message = errorMessage
      return null
    } finally {
      getTagApiData.value.loading = false
    }
  }

  // Получить предложения тегов
  const fetchTagSuggestions = async (query: string, type?: string, limit?: number): Promise<void> => {
    resetApiState(getTagSuggestionsApiData.value)
    getTagSuggestionsApiData.value.loading = true

    try {
      const response = await getTagSuggestions(query, type, limit)

      if (response.data?.tagSuggestions?.successfully && response.data.tagSuggestions.data) {
        const data = response.data.tagSuggestions.data
        tagSuggestions.value = data
        getTagSuggestionsApiData.value.data = data
        getTagSuggestionsApiData.value.success = true
        getTagSuggestionsApiData.value.message = response.data.tagSuggestions.message || 'Предложения тегов загружены'
      } else {
        const errorMsg = response.data?.tagSuggestions?.error || response.data?.tagSuggestions?.message || 'Ошибка загрузки предложений тегов'
        getTagSuggestionsApiData.value.error = true
        getTagSuggestionsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки предложений тегов'
      getTagSuggestionsApiData.value.error = true
      getTagSuggestionsApiData.value.message = errorMessage
    } finally {
      getTagSuggestionsApiData.value.loading = false
    }
  }

  // Создать тег
  const createTagAction = async (input: CreateTagInput): Promise<Tag | null> => {
    resetApiState(createTagApiData.value)
    createTagApiData.value.loading = true

    try {
      const response = await createTag(input)

      if (response.data?.createTag?.successfully && response.data.createTag.data) {
        const tag = response.data.createTag.data
        createTagApiData.value.data = tag
        createTagApiData.value.success = true
        createTagApiData.value.message = response.data.createTag.message || 'Тег создан'
        
        // Добавляем в список тегов
        tags.value.push(tag)
        
        return tag
      } else {
        const errorMsg = response.data?.createTag?.error || response.data?.createTag?.message || 'Ошибка создания тега'
        createTagApiData.value.error = true
        createTagApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка создания тега'
      createTagApiData.value.error = true
      createTagApiData.value.message = errorMessage
      return null
    } finally {
      createTagApiData.value.loading = false
    }
  }

  return {
    // State
    tags,
    currentTag,
    tagSuggestions,
    
    // API States
    getTagsApiData,
    getTagApiData,
    getTagSuggestionsApiData,
    createTagApiData,
    
    // Getters
    tagsGetters,
    currentTagGetters,
    tagSuggestionsGetters,
    
    // API Data Getters
    getTagsApiDataGetters,
    getTagApiDataGetters,
    getTagSuggestionsApiDataGetters,
    createTagApiDataGetters,
    
    // Actions
    fetchTags,
    fetchTag,
    fetchTagSuggestions,
    createTagAction
  }
})
