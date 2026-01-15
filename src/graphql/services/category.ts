import client from '../index'
import { GET_CATEGORIES, type GetCategoriesResult } from '../queries/get-categories'
import { GET_CATEGORY, type GetCategoryResult } from '../queries/get-category'
import { GET_SUBCATEGORIES, type GetSubcategoriesResult } from '../queries/get-subcategories'
import { GET_SUBCATEGORY, type GetSubcategoryResult } from '../queries/get-subcategory'

/**
 * Получить список категорий
 */
export const getCategories = async (includeInactive?: boolean) => {
  return await client.query<GetCategoriesResult>({
    query: GET_CATEGORIES,
    variables: { includeInactive },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить категорию по ID
 */
export const getCategory = async (id: string) => {
  return await client.query<GetCategoryResult>({
    query: GET_CATEGORY,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить список подкатегорий
 */
export const getSubcategories = async (params?: { categoryId?: string; includeInactive?: boolean }) => {
  return await client.query<GetSubcategoriesResult>({
    query: GET_SUBCATEGORIES,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить подкатегорию по ID
 */
export const getSubcategory = async (id: string) => {
  return await client.query<GetSubcategoryResult>({
    query: GET_SUBCATEGORY,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}
