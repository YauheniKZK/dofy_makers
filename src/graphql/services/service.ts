import client from '../index'
import { GET_SERVICES, type GetServicesResult } from '../queries/get-services'
import { GET_SERVICE, type GetServiceResult } from '../queries/get-service'
import { CREATE_SERVICE, type CreateServiceInput, type CreateServiceResult } from '../mutations/create-service'
import { UPDATE_SERVICE, type UpdateServiceInput, type UpdateServiceResult } from '../mutations/update-service'
import { DELETE_SERVICE, type DeleteServiceResult } from '../mutations/delete-service'
import { ATTACH_TAGS_TO_SERVICE, type AttachTagsToServiceInput, type AttachTagsToServiceResult } from '../mutations/attach-tags-to-service'
import { REMOVE_TAG_FROM_SERVICE, type RemoveTagFromServiceInput, type RemoveTagFromServiceResult } from '../mutations/remove-tag-from-service'
import { ATTACH_MATERIALS_TO_SERVICE, type AttachMaterialsToServiceInput, type AttachMaterialsToServiceResult } from '../mutations/attach-materials-to-service'
import { REMOVE_MATERIAL_FROM_SERVICE, type RemoveMaterialFromServiceInput, type RemoveMaterialFromServiceResult } from '../mutations/remove-material-from-service'

/**
 * Получить список услуг
 */
export const getServices = async (params?: { userId?: string; subcategoryId?: string; limit?: number; offset?: number }) => {
  return await client.query<GetServicesResult>({
    query: GET_SERVICES,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить услугу по ID
 */
export const getService = async (id: string) => {
  return await client.query<GetServiceResult>({
    query: GET_SERVICE,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Создать услугу
 */
export const createService = async (input: CreateServiceInput) => {
  return await client.mutate<CreateServiceResult>({
    mutation: CREATE_SERVICE,
    variables: { input }
  })
}

/**
 * Обновить услугу
 */
export const updateService = async (input: UpdateServiceInput) => {
  return await client.mutate<UpdateServiceResult>({
    mutation: UPDATE_SERVICE,
    variables: { input }
  })
}

/**
 * Удалить услугу
 */
export const deleteService = async (serviceId: string) => {
  return await client.mutate<DeleteServiceResult>({
    mutation: DELETE_SERVICE,
    variables: { serviceId }
  })
}

/**
 * Прикрепить теги к услуге
 */
export const attachTagsToService = async (input: AttachTagsToServiceInput) => {
  return await client.mutate<AttachTagsToServiceResult>({
    mutation: ATTACH_TAGS_TO_SERVICE,
    variables: { input }
  })
}

/**
 * Удалить тег из услуги
 */
export const removeTagFromService = async (input: RemoveTagFromServiceInput) => {
  return await client.mutate<RemoveTagFromServiceResult>({
    mutation: REMOVE_TAG_FROM_SERVICE,
    variables: { input }
  })
}

/**
 * Прикрепить материалы к услуге
 */
export const attachMaterialsToService = async (input: AttachMaterialsToServiceInput) => {
  return await client.mutate<AttachMaterialsToServiceResult>({
    mutation: ATTACH_MATERIALS_TO_SERVICE,
    variables: { input }
  })
}

/**
 * Удалить материал из услуги
 */
export const removeMaterialFromService = async (input: RemoveMaterialFromServiceInput) => {
  return await client.mutate<RemoveMaterialFromServiceResult>({
    mutation: REMOVE_MATERIAL_FROM_SERVICE,
    variables: { input }
  })
}
