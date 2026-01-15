import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getCategories,
  getCategory,
  getSubcategories,
  getSubcategory
} from '@/graphql/services/category'
import type { Category } from '@/graphql/queries/get-categories'
import type { Subcategory } from '@/graphql/queries/get-subcategories'

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

export const useCategoryStore = defineStore('category', () => {
  // -----------------STATE---------------------
  const categories = ref<Category[]>([])
  const currentCategory = ref<Category | null>(null)
  const subcategories = ref<Subcategory[]>([])
  const currentSubcategory = ref<Subcategory | null>(null)

  // Состояния для каждого API запроса
  const getCategoriesApiData = ref<ApiState<Category[]>>(createDefaultApiState<Category[]>())
  const getCategoryApiData = ref<ApiState<Category>>(createDefaultApiState<Category>())
  const getSubcategoriesApiData = ref<ApiState<Subcategory[]>>(createDefaultApiState<Subcategory[]>())
  const getSubcategoryApiData = ref<ApiState<Subcategory>>(createDefaultApiState<Subcategory>())

  // -----------------GETTERS---------------------
  const categoriesGetters = computed(() => categories.value)
  const currentCategoryGetters = computed(() => currentCategory.value)
  const subcategoriesGetters = computed(() => subcategories.value)
  const currentSubcategoryGetters = computed(() => currentSubcategory.value)

  // Геттеры для API состояний
  const getCategoriesApiDataGetters = computed(() => getCategoriesApiData.value)
  const getCategoryApiDataGetters = computed(() => getCategoryApiData.value)
  const getSubcategoriesApiDataGetters = computed(() => getSubcategoriesApiData.value)
  const getSubcategoryApiDataGetters = computed(() => getSubcategoryApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список категорий
  const fetchCategories = async (includeInactive?: boolean): Promise<void> => {
    resetApiState(getCategoriesApiData.value)
    getCategoriesApiData.value.loading = true

    try {
      const response = await getCategories(includeInactive)

      if (response.data?.categories?.successfully && response.data.categories.data) {
        const data = response.data.categories.data
        categories.value = data
        getCategoriesApiData.value.data = data
        getCategoriesApiData.value.success = true
        getCategoriesApiData.value.message = response.data.categories.message || 'Категории загружены'
      } else {
        const errorMsg = response.data?.categories?.error || response.data?.categories?.message || 'Ошибка загрузки категорий'
        getCategoriesApiData.value.error = true
        getCategoriesApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки категорий'
      getCategoriesApiData.value.error = true
      getCategoriesApiData.value.message = errorMessage
    } finally {
      getCategoriesApiData.value.loading = false
    }
  }

  // Получить категорию по ID
  const fetchCategory = async (id: string): Promise<Category | null> => {
    resetApiState(getCategoryApiData.value)
    getCategoryApiData.value.loading = true

    try {
      const response = await getCategory(id)

      if (response.data?.category?.successfully && response.data.category.data) {
        const category = response.data.category.data
        currentCategory.value = category
        getCategoryApiData.value.data = category
        getCategoryApiData.value.success = true
        getCategoryApiData.value.message = response.data.category.message || 'Категория загружена'
        return category
      } else {
        const errorMsg = response.data?.category?.error || response.data?.category?.message || 'Категория не найдена'
        getCategoryApiData.value.error = true
        getCategoryApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки категории'
      getCategoryApiData.value.error = true
      getCategoryApiData.value.message = errorMessage
      return null
    } finally {
      getCategoryApiData.value.loading = false
    }
  }

  // Получить список подкатегорий
  const fetchSubcategories = async (params?: { categoryId?: string; includeInactive?: boolean }): Promise<void> => {
    resetApiState(getSubcategoriesApiData.value)
    getSubcategoriesApiData.value.loading = true

    try {
      const response = await getSubcategories(params)

      if (response.data?.subcategories?.successfully && response.data.subcategories.data) {
        const data = response.data.subcategories.data
        subcategories.value = data
        getSubcategoriesApiData.value.data = data
        getSubcategoriesApiData.value.success = true
        getSubcategoriesApiData.value.message = response.data.subcategories.message || 'Подкатегории загружены'
      } else {
        const errorMsg = response.data?.subcategories?.error || response.data?.subcategories?.message || 'Ошибка загрузки подкатегорий'
        getSubcategoriesApiData.value.error = true
        getSubcategoriesApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки подкатегорий'
      getSubcategoriesApiData.value.error = true
      getSubcategoriesApiData.value.message = errorMessage
    } finally {
      getSubcategoriesApiData.value.loading = false
    }
  }

  // Получить подкатегорию по ID
  const fetchSubcategory = async (id: string): Promise<Subcategory | null> => {
    resetApiState(getSubcategoryApiData.value)
    getSubcategoryApiData.value.loading = true

    try {
      const response = await getSubcategory(id)

      if (response.data?.subcategory?.successfully && response.data.subcategory.data) {
        const subcategory = response.data.subcategory.data
        currentSubcategory.value = subcategory
        getSubcategoryApiData.value.data = subcategory
        getSubcategoryApiData.value.success = true
        getSubcategoryApiData.value.message = response.data.subcategory.message || 'Подкатегория загружена'
        return subcategory
      } else {
        const errorMsg = response.data?.subcategory?.error || response.data?.subcategory?.message || 'Подкатегория не найдена'
        getSubcategoryApiData.value.error = true
        getSubcategoryApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки подкатегории'
      getSubcategoryApiData.value.error = true
      getSubcategoryApiData.value.message = errorMessage
      return null
    } finally {
      getSubcategoryApiData.value.loading = false
    }
  }

  return {
    // State
    categories,
    currentCategory,
    subcategories,
    currentSubcategory,
    
    // API States
    getCategoriesApiData,
    getCategoryApiData,
    getSubcategoriesApiData,
    getSubcategoryApiData,
    
    // Getters
    categoriesGetters,
    currentCategoryGetters,
    subcategoriesGetters,
    currentSubcategoryGetters,
    
    // API Data Getters
    getCategoriesApiDataGetters,
    getCategoryApiDataGetters,
    getSubcategoriesApiDataGetters,
    getSubcategoryApiDataGetters,
    
    // Actions
    fetchCategories,
    fetchCategory,
    fetchSubcategories,
    fetchSubcategory
  }
})
