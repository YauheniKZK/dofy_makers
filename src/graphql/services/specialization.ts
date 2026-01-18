import client from '../index'
import {
  GET_ALL_SPECIALIZATIONS,
  GET_SYSTEM_SPECIALIZATIONS,
  GET_PATIENT_SPECIALIZATIONS,
  type GetAllSpecializationsResult
} from '../queries/get-all-specializations'
import {
  GET_SPECIALIZATION_BY_ID,
  type GetSpecializationByIdResult
} from '../queries/get-specialization-by-id'
import {
  GET_USER_SPECIALIZATIONS,
  type GetUserSpecializationsResult
} from '../queries/get-user-specializations'
import {
  GET_SPECIALIZATION_USERS,
  type GetSpecializationUsersResult
} from '../queries/get-specialization-users'
import {
  GET_ME_WITH_SPECIALIZATIONS,
  GET_USER_WITH_SPECIALIZATIONS,
  type GetMeWithSpecializationsResult,
  type GetUserWithSpecializationsResult
} from '../queries/get-me-with-specializations'
import {
  ATTACH_SPECIALIZATION_TO_USER,
  type AttachSpecializationToUserInput,
  type AttachSpecializationToUserResult
} from '../mutations/attach-specialization-to-user'
import {
  DETACH_SPECIALIZATION_FROM_USER,
  type DetachSpecializationFromUserInput,
  type DetachSpecializationFromUserResult
} from '../mutations/detach-specialization-from-user'
import {
  CREATE_SPECIALIZATION,
  type CreateSpecializationInput,
  type CreateSpecializationResult
} from '../mutations/create-specialization'
import {
  UPDATE_SPECIALIZATION,
  type UpdateSpecializationInput,
  type UpdateSpecializationResult
} from '../mutations/update-specialization'
import {
  DELETE_SPECIALIZATION,
  type DeleteSpecializationResult
} from '../mutations/delete-specialization'

// ============================================
// QUERY ЗАПРОСЫ (чтение данных)
// ============================================

/**
 * Получить все специализации
 */
const getAllSpecializations = async () => {
  return await client.query<GetAllSpecializationsResult>({
    query: GET_ALL_SPECIALIZATIONS,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить только системные специализации
 */
const getSystemSpecializations = async () => {
  return await client.query<GetAllSpecializationsResult>({
    query: GET_SYSTEM_SPECIALIZATIONS,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить только пользовательские специализации
 */
const getPatientSpecializations = async () => {
  return await client.query<GetAllSpecializationsResult>({
    query: GET_PATIENT_SPECIALIZATIONS,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить специализацию по ID
 */
const getSpecializationById = async (id: string) => {
  return await client.query<GetSpecializationByIdResult>({
    query: GET_SPECIALIZATION_BY_ID,
    variables: { id },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить специализации конкретного пользователя
 */
const getUserSpecializations = async (userId: string) => {
  return await client.query<GetUserSpecializationsResult>({
    query: GET_USER_SPECIALIZATIONS,
    variables: { userId },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить всех пользователей с определенной специализацией
 */
const getSpecializationUsers = async (specializationId: string) => {
  return await client.query<GetSpecializationUsersResult>({
    query: GET_SPECIALIZATION_USERS,
    variables: { specializationId },
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить текущего пользователя со специализациями
 */
const getMeWithSpecializations = async () => {
  return await client.query<GetMeWithSpecializationsResult>({
    query: GET_ME_WITH_SPECIALIZATIONS,
    fetchPolicy: 'no-cache'
  })
}

/**
 * Получить пользователя по ID со специализациями
 */
const getUserWithSpecializations = async (userId: string) => {
  return await client.query<GetUserWithSpecializationsResult>({
    query: GET_USER_WITH_SPECIALIZATIONS,
    variables: { userId },
    fetchPolicy: 'no-cache'
  })
}

// ============================================
// MUTATION ЗАПРОСЫ (изменение данных)
// ============================================

/**
 * Привязать специализацию к пользователю
 */
const attachSpecializationToUser = async (input: AttachSpecializationToUserInput) => {
  return await client.mutate<AttachSpecializationToUserResult>({
    mutation: ATTACH_SPECIALIZATION_TO_USER,
    variables: { input }
  })
}

/**
 * Отвязать специализацию от пользователя
 */
const detachSpecializationFromUser = async (input: DetachSpecializationFromUserInput) => {
  return await client.mutate<DetachSpecializationFromUserResult>({
    mutation: DETACH_SPECIALIZATION_FROM_USER,
    variables: { input }
  })
}

/**
 * Создать специализацию
 */
const createSpecialization = async (input: CreateSpecializationInput) => {
  return await client.mutate<CreateSpecializationResult>({
    mutation: CREATE_SPECIALIZATION,
    variables: { input }
  })
}

/**
 * Обновить специализацию
 */
const updateSpecialization = async (input: UpdateSpecializationInput) => {
  return await client.mutate<UpdateSpecializationResult>({
    mutation: UPDATE_SPECIALIZATION,
    variables: { input }
  })
}

/**
 * Удалить специализацию
 */
const deleteSpecialization = async (specializationId: string) => {
  return await client.mutate<DeleteSpecializationResult>({
    mutation: DELETE_SPECIALIZATION,
    variables: { specializationId }
  })
}

export {
  // Queries
  getAllSpecializations,
  getSystemSpecializations,
  getPatientSpecializations,
  getSpecializationById,
  getUserSpecializations,
  getSpecializationUsers,
  getMeWithSpecializations,
  getUserWithSpecializations,
  // Mutations
  attachSpecializationToUser,
  detachSpecializationFromUser,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization
}
