import client from '../index'
import { GET_PRODUCTS, type GetProductsResult } from '../queries/get-products'
import { GET_PRODUCT, type GetProductResult } from '../queries/get-product'
import { GET_PRODUCT_STAGES, type GetProductStagesResult } from '../queries/get-product-stages'
import { GET_PRODUCT_STAGE, type GetProductStageResult } from '../queries/get-product-stage'
import { CREATE_PRODUCT, type CreateProductInput, type CreateProductResult } from '../mutations/create-product'
import { UPDATE_PRODUCT, type UpdateProductInput, type UpdateProductResult } from '../mutations/update-product'
import { DELETE_PRODUCT, type DeleteProductResult } from '../mutations/delete-product'
import { ATTACH_TAGS_TO_PRODUCT, type AttachTagsToProductInput, type AttachTagsToProductResult } from '../mutations/attach-tags-to-product'
import { REMOVE_TAG_FROM_PRODUCT, type RemoveTagFromProductInput, type RemoveTagFromProductResult } from '../mutations/remove-tag-from-product'
import { ATTACH_MATERIALS_TO_PRODUCT, type AttachMaterialsToProductInput, type AttachMaterialsToProductResult } from '../mutations/attach-materials-to-product'
import { REMOVE_MATERIAL_FROM_PRODUCT, type RemoveMaterialFromProductInput, type RemoveMaterialFromProductResult } from '../mutations/remove-material-from-product'
import { CREATE_PRODUCT_STAGE, type CreateProductStageInput, type CreateProductStageResult } from '../mutations/create-product-stage'
import { UPDATE_PRODUCT_STAGE, type UpdateProductStageInput, type UpdateProductStageResult } from '../mutations/update-product-stage'
import { DELETE_PRODUCT_STAGE, type DeleteProductStageResult } from '../mutations/delete-product-stage'

/**
 * Получить список продуктов
 */
export const getProducts = async (params?: { userId?: string; subcategoryId?: string; limit?: number; offset?: number }) => {
  return await client.query<GetProductsResult>({
    query: GET_PRODUCTS,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить продукт по ID
 */
export const getProduct = async (id: string) => {
  return await client.query<GetProductResult>({
    query: GET_PRODUCT,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить список этапов продукта
 */
export const getProductStages = async (productId: string) => {
  return await client.query<GetProductStagesResult>({
    query: GET_PRODUCT_STAGES,
    variables: { productId },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить этап продукта по ID
 */
export const getProductStage = async (id: string) => {
  return await client.query<GetProductStageResult>({
    query: GET_PRODUCT_STAGE,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Создать продукт
 */
export const createProduct = async (input: CreateProductInput) => {
  return await client.mutate<CreateProductResult>({
    mutation: CREATE_PRODUCT,
    variables: { input }
  })
}

/**
 * Обновить продукт
 */
export const updateProduct = async (input: UpdateProductInput) => {
  return await client.mutate<UpdateProductResult>({
    mutation: UPDATE_PRODUCT,
    variables: { input }
  })
}

/**
 * Удалить продукт
 */
export const deleteProduct = async (productId: string) => {
  return await client.mutate<DeleteProductResult>({
    mutation: DELETE_PRODUCT,
    variables: { productId }
  })
}

/**
 * Прикрепить теги к продукту
 */
export const attachTagsToProduct = async (input: AttachTagsToProductInput) => {
  return await client.mutate<AttachTagsToProductResult>({
    mutation: ATTACH_TAGS_TO_PRODUCT,
    variables: { input }
  })
}

/**
 * Удалить тег из продукта
 */
export const removeTagFromProduct = async (input: RemoveTagFromProductInput) => {
  return await client.mutate<RemoveTagFromProductResult>({
    mutation: REMOVE_TAG_FROM_PRODUCT,
    variables: { input }
  })
}

/**
 * Прикрепить материалы к продукту
 */
export const attachMaterialsToProduct = async (input: AttachMaterialsToProductInput) => {
  return await client.mutate<AttachMaterialsToProductResult>({
    mutation: ATTACH_MATERIALS_TO_PRODUCT,
    variables: { input }
  })
}

/**
 * Удалить материал из продукта
 */
export const removeMaterialFromProduct = async (input: RemoveMaterialFromProductInput) => {
  return await client.mutate<RemoveMaterialFromProductResult>({
    mutation: REMOVE_MATERIAL_FROM_PRODUCT,
    variables: { input }
  })
}

/**
 * Создать этап продукта
 */
export const createProductStage = async (input: CreateProductStageInput) => {
  return await client.mutate<CreateProductStageResult>({
    mutation: CREATE_PRODUCT_STAGE,
    variables: { input }
  })
}

/**
 * Обновить этап продукта
 */
export const updateProductStage = async (input: UpdateProductStageInput) => {
  return await client.mutate<UpdateProductStageResult>({
    mutation: UPDATE_PRODUCT_STAGE,
    variables: { input }
  })
}

/**
 * Удалить этап продукта
 */
export const deleteProductStage = async (stageId: string) => {
  return await client.mutate<DeleteProductStageResult>({
    mutation: DELETE_PRODUCT_STAGE,
    variables: { stageId }
  })
}
