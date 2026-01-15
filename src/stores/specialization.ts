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
  detachSpecializationFromUser
} from '@/graphql/services/specialization'
import type { Specialization } from '@/graphql/interface'
import type { AttachSpecializationToUserInput } from '@/graphql/mutations/attach-specialization-to-user'
import type { DetachSpecializationFromUserInput } from '@/graphql/mutations/detach-specialization-from-user'

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
  const fetchUserSpecializations = async (userId: string): Promise<void> => {
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
    
    // Actions
    fetchAllSpecializations,
    fetchSystemSpecializations,
    fetchPatientSpecializations,
    fetchSpecializationById,
    fetchUserSpecializations,
    fetchMeWithSpecializations,
    attachSpecializationToUserAction,
    detachSpecializationFromUserAction
  }
})
