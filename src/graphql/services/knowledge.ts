import client from '../index'
import { GET_KNOWLEDGE_CATEGORIES, type GetKnowledgeCategoriesResult } from '../queries/get-knowledge-categories'
import { GET_KNOWLEDGE_CATEGORY, type GetKnowledgeCategoryResult } from '../queries/get-knowledge-category'
import { GET_KNOWLEDGE_SUBCATEGORIES, type GetKnowledgeSubcategoriesResult } from '../queries/get-knowledge-subcategories'
import { GET_KNOWLEDGE_SUBCATEGORY, type GetKnowledgeSubcategoryResult } from '../queries/get-knowledge-subcategory'
import { GET_KNOWLEDGE_ITEMS, type GetKnowledgeItemsResult } from '../queries/get-knowledge-items'
import { GET_KNOWLEDGE_ITEM, type GetKnowledgeItemResult } from '../queries/get-knowledge-item'

/**
 * Получить список категорий знаний
 */
export const getKnowledgeCategories = async (includeInactive?: boolean) => {
  return await client.query<GetKnowledgeCategoriesResult>({
    query: GET_KNOWLEDGE_CATEGORIES,
    variables: { includeInactive },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить категорию знаний по ID
 */
export const getKnowledgeCategory = async (id: string) => {
  return await client.query<GetKnowledgeCategoryResult>({
    query: GET_KNOWLEDGE_CATEGORY,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить список подкатегорий знаний
 */
export const getKnowledgeSubcategories = async (params?: { categoryId?: string; includeInactive?: boolean }) => {
  return await client.query<GetKnowledgeSubcategoriesResult>({
    query: GET_KNOWLEDGE_SUBCATEGORIES,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить подкатегорию знаний по ID
 */
export const getKnowledgeSubcategory = async (id: string) => {
  return await client.query<GetKnowledgeSubcategoryResult>({
    query: GET_KNOWLEDGE_SUBCATEGORY,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить список элементов знаний
 */
export const getKnowledgeItems = async (params?: { categoryId?: string; subcategoryId?: string; authorId?: string; limit?: number; offset?: number }) => {
  return await client.query<GetKnowledgeItemsResult>({
    query: GET_KNOWLEDGE_ITEMS,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить элемент знаний по ID
 */
export const getKnowledgeItem = async (id: string) => {
  return await client.query<GetKnowledgeItemResult>({
    query: GET_KNOWLEDGE_ITEM,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}
