import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getAllSpecializations,
  getSystemSpecializations,
  getPatientSpecializations,
  getSpecializationById,
  getUserSpecializations,
  getSpecializationUsers,
  getMeWithSpecializations,
  getUserWithSpecializations,
  attachSpecializationToUser,
  detachSpecializationFromUser,
  createSpecialization,
  updateSpecialization,
  deleteSpecialization
} from '@/graphql/services/specialization'
import type { Specialization } from '@/graphql/interface'
import type { AttachSpecializationToUserInput } from '@/graphql/mutations/attach-specialization-to-user'
import type { DetachSpecializationFromUserInput } from '@/graphql/mutations/detach-specialization-from-user'
import type { CreateSpecializationInput } from '@/graphql/mutations/create-specialization'
import type { UpdateSpecializationInput } from '@/graphql/mutations/update-specialization'

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

export const useSpecializationStore = defineStore('specialization', () => {
  // -----------------STATE---------------------
  const allSpecializations = ref<Specialization[]>([])
  const systemSpecializations = ref<Specialization[]>([])
  const patientSpecializations = ref<Specialization[]>([])
  const currentUserSpecializations = ref<Specialization[]>([])

  // Состояния для каждого API запроса
  const getAllSpecializationsApiData = ref<ApiState<Specialization[]>>(createDefaultApiState<Specialization[]>())
  const getSystemSpecializationsApiData = ref<ApiState<Specialization[]>>(createDefaultApiState<Specialization[]>())
  const getPatientSpecializationsApiData = ref<ApiState<Specialization[]>>(createDefaultApiState<Specialization[]>())
  const getSpecializationByIdApiData = ref<ApiState<Specialization>>(createDefaultApiState<Specialization>())
  const getUserSpecializationsApiData = ref<ApiState<Specialization[]>>(createDefaultApiState<Specialization[]>())
  const getSpecializationUsersApiData = ref<ApiState<any>>(createDefaultApiState<any>())
  const getMeWithSpecializationsApiData = ref<ApiState<Specialization[]>>(createDefaultApiState<Specialization[]>())
  const getUserWithSpecializationsApiData = ref<ApiState<Specialization[]>>(createDefaultApiState<Specialization[]>())
  const attachSpecializationApiData = ref<ApiState<Specialization>>(createDefaultApiState<Specialization>())
  const detachSpecializationApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())
  const createSpecializationApiData = ref<ApiState<Specialization>>(createDefaultApiState<Specialization>())
  const updateSpecializationApiData = ref<ApiState<Specialization>>(createDefaultApiState<Specialization>())
  const deleteSpecializationApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())

  // -----------------GETTERS---------------------
  const allSpecializationsGetters = computed(() => allSpecializations.value)
  const systemSpecializationsGetters = computed(() => systemSpecializations.value)
  const patientSpecializationsGetters = computed(() => patientSpecializations.value)
  const currentUserSpecializationsGetters = computed(() => currentUserSpecializations.value)

  // Геттеры для API состояний
  const getAllSpecializationsApiDataGetters = computed(() => getAllSpecializationsApiData.value)
  const getSystemSpecializationsApiDataGetters = computed(() => getSystemSpecializationsApiData.value)
  const getPatientSpecializationsApiDataGetters = computed(() => getPatientSpecializationsApiData.value)
  const getSpecializationByIdApiDataGetters = computed(() => getSpecializationByIdApiData.value)
  const getUserSpecializationsApiDataGetters = computed(() => getUserSpecializationsApiData.value)
  const getSpecializationUsersApiDataGetters = computed(() => getSpecializationUsersApiData.value)
  const getMeWithSpecializationsApiDataGetters = computed(() => getMeWithSpecializationsApiData.value)
  const getUserWithSpecializationsApiDataGetters = computed(() => getUserWithSpecializationsApiData.value)
  const attachSpecializationApiDataGetters = computed(() => attachSpecializationApiData.value)
  const detachSpecializationApiDataGetters = computed(() => detachSpecializationApiData.value)
  const createSpecializationApiDataGetters = computed(() => createSpecializationApiData.value)
  const updateSpecializationApiDataGetters = computed(() => updateSpecializationApiData.value)
  const deleteSpecializationApiDataGetters = computed(() => deleteSpecializationApiData.value)

  // -----------------ACTIONS---------------------

  // Получить все специализации
  const fetchAllSpecializations = async (): Promise<void> => {
    resetApiState(getAllSpecializationsApiData.value)
    getAllSpecializationsApiData.value.loading = true

    try {
      const response = await getAllSpecializations()

      if (response.data?.specializations?.successfully && response.data.specializations.data) {
        const specializations = response.data.specializations.data
        allSpecializations.value = specializations
        getAllSpecializationsApiData.value.data = specializations
        getAllSpecializationsApiData.value.success = true
        getAllSpecializationsApiData.value.message = response.data.specializations.message || 'Специализации загружены'
      } else {
        const errorMsg = response.data?.specializations?.error || response.data?.specializations?.message || 'Ошибка загрузки специализаций'
        getAllSpecializationsApiData.value.error = true
        getAllSpecializationsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки специализаций'
      getAllSpecializationsApiData.value.error = true
      getAllSpecializationsApiData.value.message = errorMessage
    } finally {
      getAllSpecializationsApiData.value.loading = false
    }
  }

  // Получить системные специализации
  const fetchSystemSpecializations = async (): Promise<void> => {
    resetApiState(getSystemSpecializationsApiData.value)
    getSystemSpecializationsApiData.value.loading = true

    try {
      const response = await getSystemSpecializations()

      if (response.data?.specializations?.successfully && response.data.specializations.data) {
        const specializations = response.data.specializations.data
        systemSpecializations.value = specializations
        getSystemSpecializationsApiData.value.data = specializations
        getSystemSpecializationsApiData.value.success = true
        getSystemSpecializationsApiData.value.message = response.data.specializations.message || 'Системные специализации загружены'
      } else {
        const errorMsg = response.data?.specializations?.error || response.data?.specializations?.message || 'Ошибка загрузки системных специализаций'
        getSystemSpecializationsApiData.value.error = true
        getSystemSpecializationsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки системных специализаций'
      getSystemSpecializationsApiData.value.error = true
      getSystemSpecializationsApiData.value.message = errorMessage
    } finally {
      getSystemSpecializationsApiData.value.loading = false
    }
  }

  // Получить пользовательские специализации
  const fetchPatientSpecializations = async (): Promise<void> => {
    resetApiState(getPatientSpecializationsApiData.value)
    getPatientSpecializationsApiData.value.loading = true

    try {
      const response = await getPatientSpecializations()

      if (response.data?.specializations?.successfully && response.data.specializations.data) {
        const specializations = response.data.specializations.data
        patientSpecializations.value = specializations
        getPatientSpecializationsApiData.value.data = specializations
        getPatientSpecializationsApiData.value.success = true
        getPatientSpecializationsApiData.value.message = response.data.specializations.message || 'Пользовательские специализации загружены'
      } else {
        const errorMsg = response.data?.specializations?.error || response.data?.specializations?.message || 'Ошибка загрузки пользовательских специализаций'
        getPatientSpecializationsApiData.value.error = true
        getPatientSpecializationsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки пользовательских специализаций'
      getPatientSpecializationsApiData.value.error = true
      getPatientSpecializationsApiData.value.message = errorMessage
    } finally {
      getPatientSpecializationsApiData.value.loading = false
    }
  }

  // Получить специализацию по ID
  const fetchSpecializationById = async (id: string): Promise<Specialization | null> => {
    resetApiState(getSpecializationByIdApiData.value)
    getSpecializationByIdApiData.value.loading = true

    try {
      const response = await getSpecializationById(id)

      if (response.data?.specialization?.successfully && response.data.specialization.data) {
        const specialization = response.data.specialization.data
        getSpecializationByIdApiData.value.data = specialization
        getSpecializationByIdApiData.value.success = true
        getSpecializationByIdApiData.value.message = response.data.specialization.message || 'Специализация загружена'
        return specialization
      } else {
        const errorMsg = response.data?.specialization?.error || response.data?.specialization?.message || 'Специализация не найдена'
        getSpecializationByIdApiData.value.error = true
        getSpecializationByIdApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки специализации'
      getSpecializationByIdApiData.value.error = true
      getSpecializationByIdApiData.value.message = errorMessage
      return null
    } finally {
      getSpecializationByIdApiData.value.loading = false
    }
  }

  // Получить специализации пользователя
  const userSpecializationsAction = async (userId: string): Promise<void> => {
    resetApiState(getUserSpecializationsApiData.value)
    getUserSpecializationsApiData.value.loading = true

    try {
      const response = await getUserSpecializations(userId)

      if (response.data?.userSpecializations?.successfully && response.data.userSpecializations.data) {
        const specializations = response.data.userSpecializations.data
        getUserSpecializationsApiData.value.data = specializations
        getUserSpecializationsApiData.value.success = true
        getUserSpecializationsApiData.value.message = response.data.userSpecializations.message || 'Специализации пользователя загружены'
      } else {
        const errorMsg = response.data?.userSpecializations?.error || response.data?.userSpecializations?.message || 'Ошибка загрузки специализаций пользователя'
        getUserSpecializationsApiData.value.error = true
        getUserSpecializationsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки специализаций пользователя'
      getUserSpecializationsApiData.value.error = true
      getUserSpecializationsApiData.value.message = errorMessage
    } finally {
      getUserSpecializationsApiData.value.loading = false
    }
  }

  // Получить текущего пользователя со специализациями
  const fetchMeWithSpecializations = async (): Promise<void> => {
    resetApiState(getMeWithSpecializationsApiData.value)
    getMeWithSpecializationsApiData.value.loading = true

    try {
      const response = await getMeWithSpecializations()

      if (response.data?.me?.successfully && response.data.me.data) {
        const specializations = response.data.me.data.specializations || []
        currentUserSpecializations.value = specializations
        getMeWithSpecializationsApiData.value.data = specializations
        getMeWithSpecializationsApiData.value.success = true
        getMeWithSpecializationsApiData.value.message = response.data.me.message || 'Специализации загружены'
      } else {
        const errorMsg = response.data?.me?.error || response.data?.me?.message || 'Ошибка загрузки специализаций'
        getMeWithSpecializationsApiData.value.error = true
        getMeWithSpecializationsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки специализаций'
      getMeWithSpecializationsApiData.value.error = true
      getMeWithSpecializationsApiData.value.message = errorMessage
    } finally {
      getMeWithSpecializationsApiData.value.loading = false
    }
  }

  // Привязать специализацию к пользователю
  const attachSpecializationToUserAction = async (input: AttachSpecializationToUserInput): Promise<Specialization | null> => {
    resetApiState(attachSpecializationApiData.value)
    attachSpecializationApiData.value.loading = true

    try {
      const response = await attachSpecializationToUser(input)

      if (response.data?.attachSpecializationToUser?.successfully && response.data.attachSpecializationToUser.data) {
        const specialization = response.data.attachSpecializationToUser.data
        attachSpecializationApiData.value.data = specialization
        attachSpecializationApiData.value.success = true
        attachSpecializationApiData.value.message = response.data.attachSpecializationToUser.message || 'Специализация привязана'
        
        // Обновляем список специализаций пользователя, если это текущий пользователь
        if (!currentUserSpecializations.value.find(s => s.id === specialization.id)) {
          currentUserSpecializations.value.push(specialization)
        }
        
        return specialization
      } else {
        const errorMsg = response.data?.attachSpecializationToUser?.error || response.data?.attachSpecializationToUser?.message || 'Ошибка привязки специализации'
        attachSpecializationApiData.value.error = true
        attachSpecializationApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка привязки специализации'
      attachSpecializationApiData.value.error = true
      attachSpecializationApiData.value.message = errorMessage
      return null
    } finally {
      attachSpecializationApiData.value.loading = false
    }
  }

  // Отвязать специализацию от пользователя
  const detachSpecializationFromUserAction = async (input: DetachSpecializationFromUserInput): Promise<boolean> => {
    resetApiState(detachSpecializationApiData.value)
    detachSpecializationApiData.value.loading = true

    try {
      const response = await detachSpecializationFromUser(input)

      if (response.data?.detachSpecializationFromUser?.successfully) {
        detachSpecializationApiData.value.data = true
        detachSpecializationApiData.value.success = true
        detachSpecializationApiData.value.message = response.data.detachSpecializationFromUser.message || 'Специализация отвязана'
        
        // Удаляем из списка специализаций пользователя
        currentUserSpecializations.value = currentUserSpecializations.value.filter(s => s.id !== input.specializationId)
        
        return true
      } else {
        const errorMsg = response.data?.detachSpecializationFromUser?.error || response.data?.detachSpecializationFromUser?.message || 'Ошибка отвязки специализации'
        detachSpecializationApiData.value.error = true
        detachSpecializationApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка отвязки специализации'
      detachSpecializationApiData.value.error = true
      detachSpecializationApiData.value.message = errorMessage
      return false
    } finally {
      detachSpecializationApiData.value.loading = false
    }
  }

  // Создать специализацию
  const createSpecializationAction = async (input: CreateSpecializationInput): Promise<Specialization | null> => {
    resetApiState(createSpecializationApiData.value)
    createSpecializationApiData.value.loading = true

    try {
      const response = await createSpecialization(input)

      if (response.data?.createSpecialization?.successfully && response.data.createSpecialization.data) {
        const specialization = response.data.createSpecialization.data
        createSpecializationApiData.value.data = specialization
        createSpecializationApiData.value.success = true
        createSpecializationApiData.value.message = response.data.createSpecialization.message || 'Специализация создана'
        
        // Если это пользовательская специализация, добавляем в список пользовательских
        if (specialization.type === 'patient') {
          if (!patientSpecializations.value.find(s => s.id === specialization.id)) {
            patientSpecializations.value.push(specialization)
          }
          // Если специализация автоматически прикреплена к создателю, добавляем в список специализаций пользователя
          if (!currentUserSpecializations.value.find(s => s.id === specialization.id)) {
            currentUserSpecializations.value.push(specialization)
          }
        } else if (specialization.type === 'system') {
          if (!systemSpecializations.value.find(s => s.id === specialization.id)) {
            systemSpecializations.value.push(specialization)
          }
        }
        
        // Обновляем общий список
        if (!allSpecializations.value.find(s => s.id === specialization.id)) {
          allSpecializations.value.push(specialization)
        }
        
        return specialization
      } else {
        const errorMsg = response.data?.createSpecialization?.error || response.data?.createSpecialization?.message || 'Ошибка создания специализации'
        createSpecializationApiData.value.error = true
        createSpecializationApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка создания специализации'
      createSpecializationApiData.value.error = true
      createSpecializationApiData.value.message = errorMessage
      return null
    } finally {
      createSpecializationApiData.value.loading = false
    }
  }

  // Обновить специализацию
  const updateSpecializationAction = async (input: UpdateSpecializationInput): Promise<Specialization | null> => {
    resetApiState(updateSpecializationApiData.value)
    updateSpecializationApiData.value.loading = true

    try {
      const response = await updateSpecialization(input)

      if (response.data?.updateSpecialization?.successfully && response.data.updateSpecialization.data) {
        const specialization = response.data.updateSpecialization.data
        updateSpecializationApiData.value.data = specialization
        updateSpecializationApiData.value.success = true
        updateSpecializationApiData.value.message = response.data.updateSpecialization.message || 'Специализация обновлена'
        
        // Обновляем в соответствующих списках
        const updateInList = (list: Specialization[]) => {
          const index = list.findIndex(s => s.id === specialization.id)
          if (index !== -1) {
            list[index] = specialization
          }
        }
        
        updateInList(allSpecializations.value)
        if (specialization.type === 'system') {
          updateInList(systemSpecializations.value)
        } else if (specialization.type === 'patient') {
          updateInList(patientSpecializations.value)
        }
        
        // Обновляем в списке специализаций пользователя, если она там есть
        const userSpecIndex = currentUserSpecializations.value.findIndex(s => s.id === specialization.id)
        if (userSpecIndex !== -1) {
          currentUserSpecializations.value[userSpecIndex] = specialization
        }
        
        return specialization
      } else {
        const errorMsg = response.data?.updateSpecialization?.error || response.data?.updateSpecialization?.message || 'Ошибка обновления специализации'
        updateSpecializationApiData.value.error = true
        updateSpecializationApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка обновления специализации'
      updateSpecializationApiData.value.error = true
      updateSpecializationApiData.value.message = errorMessage
      return null
    } finally {
      updateSpecializationApiData.value.loading = false
    }
  }

  // Удалить специализацию
  const deleteSpecializationAction = async (specializationId: string): Promise<boolean> => {
    resetApiState(deleteSpecializationApiData.value)
    deleteSpecializationApiData.value.loading = true

    try {
      const response = await deleteSpecialization(specializationId)

      if (response.data?.deleteSpecialization?.successfully) {
        deleteSpecializationApiData.value.data = true
        deleteSpecializationApiData.value.success = true
        deleteSpecializationApiData.value.message = response.data.deleteSpecialization.message || 'Специализация удалена'
        
        // Удаляем из всех списков
        allSpecializations.value = allSpecializations.value.filter(s => s.id !== specializationId)
        systemSpecializations.value = systemSpecializations.value.filter(s => s.id !== specializationId)
        patientSpecializations.value = patientSpecializations.value.filter(s => s.id !== specializationId)
        currentUserSpecializations.value = currentUserSpecializations.value.filter(s => s.id !== specializationId)
        
        return true
      } else {
        const errorMsg = response.data?.deleteSpecialization?.error || response.data?.deleteSpecialization?.message || 'Ошибка удаления специализации'
        deleteSpecializationApiData.value.error = true
        deleteSpecializationApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления специализации'
      deleteSpecializationApiData.value.error = true
      deleteSpecializationApiData.value.message = errorMessage
      return false
    } finally {
      deleteSpecializationApiData.value.loading = false
    }
  }

  return {
    // State
    allSpecializations,
    systemSpecializations,
    patientSpecializations,
    currentUserSpecializations,
    
    // API States
    getAllSpecializationsApiData,
    getSystemSpecializationsApiData,
    getPatientSpecializationsApiData,
    getSpecializationByIdApiData,
    getUserSpecializationsApiData,
    getSpecializationUsersApiData,
    getMeWithSpecializationsApiData,
    getUserWithSpecializationsApiData,
    attachSpecializationApiData,
    detachSpecializationApiData,
    createSpecializationApiData,
    updateSpecializationApiData,
    deleteSpecializationApiData,
    
    // Getters
    allSpecializationsGetters,
    systemSpecializationsGetters,
    patientSpecializationsGetters,
    currentUserSpecializationsGetters,
    
    // API Data Getters
    getAllSpecializationsApiDataGetters,
    getSystemSpecializationsApiDataGetters,
    getPatientSpecializationsApiDataGetters,
    getSpecializationByIdApiDataGetters,
    getUserSpecializationsApiDataGetters,
    getSpecializationUsersApiDataGetters,
    getMeWithSpecializationsApiDataGetters,
    getUserWithSpecializationsApiDataGetters,
    attachSpecializationApiDataGetters,
    detachSpecializationApiDataGetters,
    createSpecializationApiDataGetters,
    updateSpecializationApiDataGetters,
    deleteSpecializationApiDataGetters,
    
    // Actions
    fetchAllSpecializations,
    fetchSystemSpecializations,
    fetchPatientSpecializations,
    fetchSpecializationById,
    userSpecializationsAction,
    fetchMeWithSpecializations,
    attachSpecializationToUserAction,
    detachSpecializationFromUserAction,
    createSpecializationAction,
    updateSpecializationAction,
    deleteSpecializationAction
  }
})
