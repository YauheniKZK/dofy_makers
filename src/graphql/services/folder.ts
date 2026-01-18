import client from '../index'
import { GET_FOLDERS, type GetFoldersResult } from '../queries/get-folders'
import { GET_FOLDER, type GetFolderResult } from '../queries/get-folder'
import { CREATE_FOLDER, type CreateFolderInput, type CreateFolderResult } from '../mutations/create-folder'
import { UPDATE_FOLDER, type UpdateFolderInput, type UpdateFolderResult } from '../mutations/update-folder'
import { DELETE_FOLDER, type DeleteFolderResult } from '../mutations/delete-folder'
import { ADD_PRODUCT_TO_FOLDER, type AddProductToFolderInput, type AddProductToFolderResult } from '../mutations/add-product-to-folder'
import { ADD_PRODUCTS_TO_FOLDER, type AddProductsToFolderInput, type AddProductsToFolderResult } from '../mutations/add-products-to-folder'
import { ADD_SERVICE_TO_FOLDER, type AddServiceToFolderInput, type AddServiceToFolderResult } from '../mutations/add-service-to-folder'
import { ADD_SERVICES_TO_FOLDER, type AddServicesToFolderInput, type AddServicesToFolderResult } from '../mutations/add-services-to-folder'
import { REMOVE_PRODUCT_FROM_FOLDER, type RemoveProductFromFolderInput, type RemoveProductFromFolderResult } from '../mutations/remove-product-from-folder'
import { REMOVE_SERVICE_FROM_FOLDER, type RemoveServiceFromFolderInput, type RemoveServiceFromFolderResult } from '../mutations/remove-service-from-folder'

/**
 * Получить список папок
 */
export const getFolders = async (params?: { userId?: string; limit?: number; offset?: number }) => {
  return await client.query<GetFoldersResult>({
    query: GET_FOLDERS,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить папку по ID
 */
export const getFolder = async (id: string) => {
  return await client.query<GetFolderResult>({
    query: GET_FOLDER,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Создать папку
 */
export const createFolder = async (input: CreateFolderInput) => {
  return await client.mutate<CreateFolderResult>({
    mutation: CREATE_FOLDER,
    variables: { input }
  })
}

/**
 * Обновить папку
 */
export const updateFolder = async (input: UpdateFolderInput) => {
  return await client.mutate<UpdateFolderResult>({
    mutation: UPDATE_FOLDER,
    variables: { input }
  })
}

/**
 * Удалить папку
 */
export const deleteFolder = async (folderId: string) => {
  return await client.mutate<DeleteFolderResult>({
    mutation: DELETE_FOLDER,
    variables: { folderId }
  })
}

/**
 * Добавить товар в папку
 */
export const addProductToFolder = async (input: AddProductToFolderInput) => {
  return await client.mutate<AddProductToFolderResult>({
    mutation: ADD_PRODUCT_TO_FOLDER,
    variables: { input }
  })
}

/**
 * Добавить несколько товаров в папку
 */
export const addProductsToFolder = async (input: AddProductsToFolderInput) => {
  return await client.mutate<AddProductsToFolderResult>({
    mutation: ADD_PRODUCTS_TO_FOLDER,
    variables: { input }
  })
}

/**
 * Добавить услугу в папку
 */
export const addServiceToFolder = async (input: AddServiceToFolderInput) => {
  return await client.mutate<AddServiceToFolderResult>({
    mutation: ADD_SERVICE_TO_FOLDER,
    variables: { input }
  })
}

/**
 * Добавить несколько услуг в папку
 */
export const addServicesToFolder = async (input: AddServicesToFolderInput) => {
  return await client.mutate<AddServicesToFolderResult>({
    mutation: ADD_SERVICES_TO_FOLDER,
    variables: { input }
  })
}

/**
 * Удалить товар из папки
 */
export const removeProductFromFolder = async (input: RemoveProductFromFolderInput) => {
  return await client.mutate<RemoveProductFromFolderResult>({
    mutation: REMOVE_PRODUCT_FROM_FOLDER,
    variables: { input }
  })
}

/**
 * Удалить услугу из папки
 */
export const removeServiceFromFolder = async (input: RemoveServiceFromFolderInput) => {
  return await client.mutate<RemoveServiceFromFolderResult>({
    mutation: REMOVE_SERVICE_FROM_FOLDER,
    variables: { input }
  })
}
