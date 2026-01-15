import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getKnowledgeCategories,
  getKnowledgeCategory,
  getKnowledgeSubcategories,
  getKnowledgeSubcategory,
  getKnowledgeItems,
  getKnowledgeItem
} from '@/graphql/services/knowledge'
import type { KnowledgeCategory } from '@/graphql/queries/get-knowledge-categories'
import type { KnowledgeSubcategory } from '@/graphql/queries/get-knowledge-subcategories'
import type { KnowledgeItem } from '@/graphql/queries/get-knowledge-items'

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

export const useKnowledgeStore = defineStore('knowledge', () => {
  // -----------------STATE---------------------
  const knowledgeCategories = ref<KnowledgeCategory[]>([])
  const currentKnowledgeCategory = ref<KnowledgeCategory | null>(null)
  const knowledgeSubcategories = ref<KnowledgeSubcategory[]>([])
  const currentKnowledgeSubcategory = ref<KnowledgeSubcategory | null>(null)
  const knowledgeItems = ref<KnowledgeItem[]>([])
  const currentKnowledgeItem = ref<KnowledgeItem | null>(null)

  // Состояния для каждого API запроса
  const getKnowledgeCategoriesApiData = ref<ApiState<KnowledgeCategory[]>>(createDefaultApiState<KnowledgeCategory[]>())
  const getKnowledgeCategoryApiData = ref<ApiState<KnowledgeCategory>>(createDefaultApiState<KnowledgeCategory>())
  const getKnowledgeSubcategoriesApiData = ref<ApiState<KnowledgeSubcategory[]>>(createDefaultApiState<KnowledgeSubcategory[]>())
  const getKnowledgeSubcategoryApiData = ref<ApiState<KnowledgeSubcategory>>(createDefaultApiState<KnowledgeSubcategory>())
  const getKnowledgeItemsApiData = ref<ApiState<{ items: KnowledgeItem[]; total: number }>>(createDefaultApiState<{ items: KnowledgeItem[]; total: number }>())
  const getKnowledgeItemApiData = ref<ApiState<KnowledgeItem>>(createDefaultApiState<KnowledgeItem>())

  // -----------------GETTERS---------------------
  const knowledgeCategoriesGetters = computed(() => knowledgeCategories.value)
  const currentKnowledgeCategoryGetters = computed(() => currentKnowledgeCategory.value)
  const knowledgeSubcategoriesGetters = computed(() => knowledgeSubcategories.value)
  const currentKnowledgeSubcategoryGetters = computed(() => currentKnowledgeSubcategory.value)
  const knowledgeItemsGetters = computed(() => knowledgeItems.value)
  const currentKnowledgeItemGetters = computed(() => currentKnowledgeItem.value)

  // Геттеры для API состояний
  const getKnowledgeCategoriesApiDataGetters = computed(() => getKnowledgeCategoriesApiData.value)
  const getKnowledgeCategoryApiDataGetters = computed(() => getKnowledgeCategoryApiData.value)
  const getKnowledgeSubcategoriesApiDataGetters = computed(() => getKnowledgeSubcategoriesApiData.value)
  const getKnowledgeSubcategoryApiDataGetters = computed(() => getKnowledgeSubcategoryApiData.value)
  const getKnowledgeItemsApiDataGetters = computed(() => getKnowledgeItemsApiData.value)
  const getKnowledgeItemApiDataGetters = computed(() => getKnowledgeItemApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список категорий знаний
  const fetchKnowledgeCategories = async (includeInactive?: boolean): Promise<void> => {
    resetApiState(getKnowledgeCategoriesApiData.value)
    getKnowledgeCategoriesApiData.value.loading = true

    try {
      const response = await getKnowledgeCategories(includeInactive)

      if (response.data?.knowledgeCategories?.successfully && response.data.knowledgeCategories.data) {
        const data = response.data.knowledgeCategories.data
        knowledgeCategories.value = data
        getKnowledgeCategoriesApiData.value.data = data
        getKnowledgeCategoriesApiData.value.success = true
        getKnowledgeCategoriesApiData.value.message = response.data.knowledgeCategories.message || 'Категории знаний загружены'
      } else {
        const errorMsg = response.data?.knowledgeCategories?.error || response.data?.knowledgeCategories?.message || 'Ошибка загрузки категорий знаний'
        getKnowledgeCategoriesApiData.value.error = true
        getKnowledgeCategoriesApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки категорий знаний'
      getKnowledgeCategoriesApiData.value.error = true
      getKnowledgeCategoriesApiData.value.message = errorMessage
    } finally {
      getKnowledgeCategoriesApiData.value.loading = false
    }
  }

  // Получить категорию знаний по ID
  const fetchKnowledgeCategory = async (id: string): Promise<KnowledgeCategory | null> => {
    resetApiState(getKnowledgeCategoryApiData.value)
    getKnowledgeCategoryApiData.value.loading = true

    try {
      const response = await getKnowledgeCategory(id)

      if (response.data?.knowledgeCategory?.successfully && response.data.knowledgeCategory.data) {
        const category = response.data.knowledgeCategory.data
        currentKnowledgeCategory.value = category
        getKnowledgeCategoryApiData.value.data = category
        getKnowledgeCategoryApiData.value.success = true
        getKnowledgeCategoryApiData.value.message = response.data.knowledgeCategory.message || 'Категория знаний загружена'
        return category
      } else {
        const errorMsg = response.data?.knowledgeCategory?.error || response.data?.knowledgeCategory?.message || 'Категория знаний не найдена'
        getKnowledgeCategoryApiData.value.error = true
        getKnowledgeCategoryApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки категории знаний'
      getKnowledgeCategoryApiData.value.error = true
      getKnowledgeCategoryApiData.value.message = errorMessage
      return null
    } finally {
      getKnowledgeCategoryApiData.value.loading = false
    }
  }

  // Получить список подкатегорий знаний
  const fetchKnowledgeSubcategories = async (params?: { categoryId?: string; includeInactive?: boolean }): Promise<void> => {
    resetApiState(getKnowledgeSubcategoriesApiData.value)
    getKnowledgeSubcategoriesApiData.value.loading = true

    try {
      const response = await getKnowledgeSubcategories(params)

      if (response.data?.knowledgeSubcategories?.successfully && response.data.knowledgeSubcategories.data) {
        const data = response.data.knowledgeSubcategories.data
        knowledgeSubcategories.value = data
        getKnowledgeSubcategoriesApiData.value.data = data
        getKnowledgeSubcategoriesApiData.value.success = true
        getKnowledgeSubcategoriesApiData.value.message = response.data.knowledgeSubcategories.message || 'Подкатегории знаний загружены'
      } else {
        const errorMsg = response.data?.knowledgeSubcategories?.error || response.data?.knowledgeSubcategories?.message || 'Ошибка загрузки подкатегорий знаний'
        getKnowledgeSubcategoriesApiData.value.error = true
        getKnowledgeSubcategoriesApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки подкатегорий знаний'
      getKnowledgeSubcategoriesApiData.value.error = true
      getKnowledgeSubcategoriesApiData.value.message = errorMessage
    } finally {
      getKnowledgeSubcategoriesApiData.value.loading = false
    }
  }

  // Получить подкатегорию знаний по ID
  const fetchKnowledgeSubcategory = async (id: string): Promise<KnowledgeSubcategory | null> => {
    resetApiState(getKnowledgeSubcategoryApiData.value)
    getKnowledgeSubcategoryApiData.value.loading = true

    try {
      const response = await getKnowledgeSubcategory(id)

      if (response.data?.knowledgeSubcategory?.successfully && response.data.knowledgeSubcategory.data) {
        const subcategory = response.data.knowledgeSubcategory.data
        currentKnowledgeSubcategory.value = subcategory
        getKnowledgeSubcategoryApiData.value.data = subcategory
        getKnowledgeSubcategoryApiData.value.success = true
        getKnowledgeSubcategoryApiData.value.message = response.data.knowledgeSubcategory.message || 'Подкатегория знаний загружена'
        return subcategory
      } else {
        const errorMsg = response.data?.knowledgeSubcategory?.error || response.data?.knowledgeSubcategory?.message || 'Подкатегория знаний не найдена'
        getKnowledgeSubcategoryApiData.value.error = true
        getKnowledgeSubcategoryApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки подкатегории знаний'
      getKnowledgeSubcategoryApiData.value.error = true
      getKnowledgeSubcategoryApiData.value.message = errorMessage
      return null
    } finally {
      getKnowledgeSubcategoryApiData.value.loading = false
    }
  }

  // Получить список элементов знаний
  const fetchKnowledgeItems = async (params?: { categoryId?: string; subcategoryId?: string; authorId?: string; limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getKnowledgeItemsApiData.value)
    getKnowledgeItemsApiData.value.loading = true

    try {
      const response = await getKnowledgeItems(params)

      if (response.data?.knowledgeItems?.successfully && response.data.knowledgeItems.data) {
        const data = response.data.knowledgeItems.data
        knowledgeItems.value = data.items
        getKnowledgeItemsApiData.value.data = data
        getKnowledgeItemsApiData.value.success = true
        getKnowledgeItemsApiData.value.message = response.data.knowledgeItems.message || 'Элементы знаний загружены'
      } else {
        const errorMsg = response.data?.knowledgeItems?.error || response.data?.knowledgeItems?.message || 'Ошибка загрузки элементов знаний'
        getKnowledgeItemsApiData.value.error = true
        getKnowledgeItemsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки элементов знаний'
      getKnowledgeItemsApiData.value.error = true
      getKnowledgeItemsApiData.value.message = errorMessage
    } finally {
      getKnowledgeItemsApiData.value.loading = false
    }
  }

  // Получить элемент знаний по ID
  const fetchKnowledgeItem = async (id: string): Promise<KnowledgeItem | null> => {
    resetApiState(getKnowledgeItemApiData.value)
    getKnowledgeItemApiData.value.loading = true

    try {
      const response = await getKnowledgeItem(id)

      if (response.data?.knowledgeItem?.successfully && response.data.knowledgeItem.data) {
        const item = response.data.knowledgeItem.data
        currentKnowledgeItem.value = item
        getKnowledgeItemApiData.value.data = item
        getKnowledgeItemApiData.value.success = true
        getKnowledgeItemApiData.value.message = response.data.knowledgeItem.message || 'Элемент знаний загружен'
        return item
      } else {
        const errorMsg = response.data?.knowledgeItem?.error || response.data?.knowledgeItem?.message || 'Элемент знаний не найден'
        getKnowledgeItemApiData.value.error = true
        getKnowledgeItemApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки элемента знаний'
      getKnowledgeItemApiData.value.error = true
      getKnowledgeItemApiData.value.message = errorMessage
      return null
    } finally {
      getKnowledgeItemApiData.value.loading = false
    }
  }

  return {
    // State
    knowledgeCategories,
    currentKnowledgeCategory,
    knowledgeSubcategories,
    currentKnowledgeSubcategory,
    knowledgeItems,
    currentKnowledgeItem,
    
    // API States
    getKnowledgeCategoriesApiData,
    getKnowledgeCategoryApiData,
    getKnowledgeSubcategoriesApiData,
    getKnowledgeSubcategoryApiData,
    getKnowledgeItemsApiData,
    getKnowledgeItemApiData,
    
    // Getters
    knowledgeCategoriesGetters,
    currentKnowledgeCategoryGetters,
    knowledgeSubcategoriesGetters,
    currentKnowledgeSubcategoryGetters,
    knowledgeItemsGetters,
    currentKnowledgeItemGetters,
    
    // API Data Getters
    getKnowledgeCategoriesApiDataGetters,
    getKnowledgeCategoryApiDataGetters,
    getKnowledgeSubcategoriesApiDataGetters,
    getKnowledgeSubcategoryApiDataGetters,
    getKnowledgeItemsApiDataGetters,
    getKnowledgeItemApiDataGetters,
    
    // Actions
    fetchKnowledgeCategories,
    fetchKnowledgeCategory,
    fetchKnowledgeSubcategories,
    fetchKnowledgeSubcategory,
    fetchKnowledgeItems,
    fetchKnowledgeItem
  }
})
