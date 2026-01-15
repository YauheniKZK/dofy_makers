import client from '../index'
import { GET_MATERIALS, type GetMaterialsResult } from '../queries/get-materials'
import { GET_MATERIAL, type GetMaterialResult } from '../queries/get-material'
import { GET_MATERIAL_GROUPS, type GetMaterialGroupsResult } from '../queries/get-material-groups'
import { GET_MATERIAL_GROUP, type GetMaterialGroupResult } from '../queries/get-material-group'

/**
 * Получить список материалов
 */
export const getMaterials = async (params?: { materialGroupId?: string; includeInactive?: boolean }) => {
  return await client.query<GetMaterialsResult>({
    query: GET_MATERIALS,
    variables: params,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить материал по ID
 */
export const getMaterial = async (id: string) => {
  return await client.query<GetMaterialResult>({
    query: GET_MATERIAL,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить список групп материалов
 */
export const getMaterialGroups = async () => {
  return await client.query<GetMaterialGroupsResult>({
    query: GET_MATERIAL_GROUPS,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить группу материалов по ID
 */
export const getMaterialGroup = async (id: string) => {
  return await client.query<GetMaterialGroupResult>({
    query: GET_MATERIAL_GROUP,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}
