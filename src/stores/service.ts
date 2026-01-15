import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getServices,
  getService,
  createService,
  updateService,
  deleteService,
  attachTagsToService,
  removeTagFromService,
  attachMaterialsToService,
  removeMaterialFromService
} from '@/graphql/services/service'
import type { Service } from '@/graphql/queries/get-services'
import type { CreateServiceInput } from '@/graphql/mutations/create-service'
import type { UpdateServiceInput } from '@/graphql/mutations/update-service'
import type { AttachTagsToServiceInput } from '@/graphql/mutations/attach-tags-to-service'
import type { RemoveTagFromServiceInput } from '@/graphql/mutations/remove-tag-from-service'
import type { AttachMaterialsToServiceInput } from '@/graphql/mutations/attach-materials-to-service'
import type { RemoveMaterialFromServiceInput } from '@/graphql/mutations/remove-material-from-service'

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

export const useServiceStore = defineStore('service', () => {
  // -----------------STATE---------------------
  const services = ref<Service[]>([])
  const currentService = ref<Service | null>(null)

  // Состояния для каждого API запроса
  const getServicesApiData = ref<ApiState<{ services: Service[]; total: number }>>(createDefaultApiState<{ services: Service[]; total: number }>())
  const getServiceApiData = ref<ApiState<Service>>(createDefaultApiState<Service>())
  const createServiceApiData = ref<ApiState<Service>>(createDefaultApiState<Service>())
  const updateServiceApiData = ref<ApiState<Service>>(createDefaultApiState<Service>())
  const deleteServiceApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())
  const attachTagsToServiceApiData = ref<ApiState<Service>>(createDefaultApiState<Service>())
  const removeTagFromServiceApiData = ref<ApiState<Service>>(createDefaultApiState<Service>())
  const attachMaterialsToServiceApiData = ref<ApiState<Service>>(createDefaultApiState<Service>())
  const removeMaterialFromServiceApiData = ref<ApiState<Service>>(createDefaultApiState<Service>())

  // -----------------GETTERS---------------------
  const servicesGetters = computed(() => services.value)
  const currentServiceGetters = computed(() => currentService.value)

  // Геттеры для API состояний
  const getServicesApiDataGetters = computed(() => getServicesApiData.value)
  const getServiceApiDataGetters = computed(() => getServiceApiData.value)
  const createServiceApiDataGetters = computed(() => createServiceApiData.value)
  const updateServiceApiDataGetters = computed(() => updateServiceApiData.value)
  const deleteServiceApiDataGetters = computed(() => deleteServiceApiData.value)
  const attachTagsToServiceApiDataGetters = computed(() => attachTagsToServiceApiData.value)
  const removeTagFromServiceApiDataGetters = computed(() => removeTagFromServiceApiData.value)
  const attachMaterialsToServiceApiDataGetters = computed(() => attachMaterialsToServiceApiData.value)
  const removeMaterialFromServiceApiDataGetters = computed(() => removeMaterialFromServiceApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список услуг
  const fetchServices = async (params?: { userId?: string; subcategoryId?: string; limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getServicesApiData.value)
    getServicesApiData.value.loading = true

    try {
      const response = await getServices(params)

      if (response.data?.services?.successfully && response.data.services.data) {
        const data = response.data.services.data
        services.value = data.services
        getServicesApiData.value.data = data
        getServicesApiData.value.success = true
        getServicesApiData.value.message = response.data.services.message || 'Услуги загружены'
      } else {
        const errorMsg = response.data?.services?.error || response.data?.services?.message || 'Ошибка загрузки услуг'
        getServicesApiData.value.error = true
        getServicesApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки услуг'
      getServicesApiData.value.error = true
      getServicesApiData.value.message = errorMessage
    } finally {
      getServicesApiData.value.loading = false
    }
  }

  // Получить услугу по ID
  const fetchService = async (id: string): Promise<Service | null> => {
    resetApiState(getServiceApiData.value)
    getServiceApiData.value.loading = true

    try {
      const response = await getService(id)

      if (response.data?.service?.successfully && response.data.service.data) {
        const service = response.data.service.data
        currentService.value = service
        getServiceApiData.value.data = service
        getServiceApiData.value.success = true
        getServiceApiData.value.message = response.data.service.message || 'Услуга загружена'
        return service
      } else {
        const errorMsg = response.data?.service?.error || response.data?.service?.message || 'Услуга не найдена'
        getServiceApiData.value.error = true
        getServiceApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки услуги'
      getServiceApiData.value.error = true
      getServiceApiData.value.message = errorMessage
      return null
    } finally {
      getServiceApiData.value.loading = false
    }
  }

  // Создать услугу
  const createServiceAction = async (input: CreateServiceInput): Promise<Service | null> => {
    resetApiState(createServiceApiData.value)
    createServiceApiData.value.loading = true

    try {
      const response = await createService(input)

      if (response.data?.createService?.successfully && response.data.createService.data) {
        const service = response.data.createService.data as any
        createServiceApiData.value.data = service
        createServiceApiData.value.success = true
        createServiceApiData.value.message = response.data.createService.message || 'Услуга создана'
        
        // Добавляем в список услуг
        services.value.unshift(service)
        
        return service
      } else {
        const errorMsg = response.data?.createService?.error || response.data?.createService?.message || 'Ошибка создания услуги'
        createServiceApiData.value.error = true
        createServiceApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка создания услуги'
      createServiceApiData.value.error = true
      createServiceApiData.value.message = errorMessage
      return null
    } finally {
      createServiceApiData.value.loading = false
    }
  }

  // Обновить услугу
  const updateServiceAction = async (input: UpdateServiceInput): Promise<Service | null> => {
    resetApiState(updateServiceApiData.value)
    updateServiceApiData.value.loading = true

    try {
      const response = await updateService(input)

      if (response.data?.updateService?.successfully && response.data.updateService.data) {
        const updatedService = response.data.updateService.data as any
        updateServiceApiData.value.data = updatedService
        updateServiceApiData.value.success = true
        updateServiceApiData.value.message = response.data.updateService.message || 'Услуга обновлена'
        
        // Обновляем в списке услуг
        const index = services.value.findIndex(s => s.id === input.serviceId)
        if (index !== -1) {
          services.value[index] = { ...services.value[index], ...updatedService }
        }
        
        // Обновляем текущую услугу
        if (currentService.value?.id === input.serviceId) {
          currentService.value = { ...currentService.value, ...updatedService }
        }
        
        return updatedService
      } else {
        const errorMsg = response.data?.updateService?.error || response.data?.updateService?.message || 'Ошибка обновления услуги'
        updateServiceApiData.value.error = true
        updateServiceApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка обновления услуги'
      updateServiceApiData.value.error = true
      updateServiceApiData.value.message = errorMessage
      return null
    } finally {
      updateServiceApiData.value.loading = false
    }
  }

  // Удалить услугу
  const deleteServiceAction = async (serviceId: string): Promise<boolean> => {
    resetApiState(deleteServiceApiData.value)
    deleteServiceApiData.value.loading = true

    try {
      const response = await deleteService(serviceId)

      if (response.data?.deleteService?.successfully) {
        deleteServiceApiData.value.data = true
        deleteServiceApiData.value.success = true
        deleteServiceApiData.value.message = response.data.deleteService.message || 'Услуга удалена'
        
        // Удаляем из списка услуг
        services.value = services.value.filter(s => s.id !== serviceId)
        
        // Очищаем текущую услугу, если это она
        if (currentService.value?.id === serviceId) {
          currentService.value = null
        }
        
        return true
      } else {
        const errorMsg = response.data?.deleteService?.error || response.data?.deleteService?.message || 'Ошибка удаления услуги'
        deleteServiceApiData.value.error = true
        deleteServiceApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления услуги'
      deleteServiceApiData.value.error = true
      deleteServiceApiData.value.message = errorMessage
      return false
    } finally {
      deleteServiceApiData.value.loading = false
    }
  }

  // Прикрепить теги к услуге
  const attachTagsToServiceAction = async (input: AttachTagsToServiceInput): Promise<Service | null> => {
    resetApiState(attachTagsToServiceApiData.value)
    attachTagsToServiceApiData.value.loading = true

    try {
      const response = await attachTagsToService(input)

      if (response.data?.attachTagsToService?.successfully && response.data.attachTagsToService.data) {
        const serviceWithTags = response.data.attachTagsToService.data as any
        attachTagsToServiceApiData.value.data = serviceWithTags
        attachTagsToServiceApiData.value.success = true
        attachTagsToServiceApiData.value.message = response.data.attachTagsToService.message || 'Теги прикреплены'
        
        // Обновляем услугу в списке
        const index = services.value.findIndex(s => s.id === input.serviceId)
        if (index !== -1 && services.value[index].tags) {
          services.value[index].tags = serviceWithTags.tags
        }
        
        return serviceWithTags
      } else {
        const errorMsg = response.data?.attachTagsToService?.error || response.data?.attachTagsToService?.message || 'Ошибка прикрепления тегов'
        attachTagsToServiceApiData.value.error = true
        attachTagsToServiceApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка прикрепления тегов'
      attachTagsToServiceApiData.value.error = true
      attachTagsToServiceApiData.value.message = errorMessage
      return null
    } finally {
      attachTagsToServiceApiData.value.loading = false
    }
  }

  // Удалить тег из услуги
  const removeTagFromServiceAction = async (input: RemoveTagFromServiceInput): Promise<Service | null> => {
    resetApiState(removeTagFromServiceApiData.value)
    removeTagFromServiceApiData.value.loading = true

    try {
      const response = await removeTagFromService(input)

      if (response.data?.removeTagFromService?.successfully && response.data.removeTagFromService.data) {
        const serviceWithTags = response.data.removeTagFromService.data as any
        removeTagFromServiceApiData.value.data = serviceWithTags
        removeTagFromServiceApiData.value.success = true
        removeTagFromServiceApiData.value.message = response.data.removeTagFromService.message || 'Тег удален'
        
        // Обновляем услугу в списке
        const index = services.value.findIndex(s => s.id === input.serviceId)
        if (index !== -1 && services.value[index].tags) {
          services.value[index].tags = serviceWithTags.tags
        }
        
        return serviceWithTags
      } else {
        const errorMsg = response.data?.removeTagFromService?.error || response.data?.removeTagFromService?.message || 'Ошибка удаления тега'
        removeTagFromServiceApiData.value.error = true
        removeTagFromServiceApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления тега'
      removeTagFromServiceApiData.value.error = true
      removeTagFromServiceApiData.value.message = errorMessage
      return null
    } finally {
      removeTagFromServiceApiData.value.loading = false
    }
  }

  // Прикрепить материалы к услуге
  const attachMaterialsToServiceAction = async (input: AttachMaterialsToServiceInput): Promise<Service | null> => {
    resetApiState(attachMaterialsToServiceApiData.value)
    attachMaterialsToServiceApiData.value.loading = true

    try {
      const response = await attachMaterialsToService(input)

      if (response.data?.attachMaterialsToService?.successfully && response.data.attachMaterialsToService.data) {
        const serviceWithMaterials = response.data.attachMaterialsToService.data as any
        attachMaterialsToServiceApiData.value.data = serviceWithMaterials
        attachMaterialsToServiceApiData.value.success = true
        attachMaterialsToServiceApiData.value.message = response.data.attachMaterialsToService.message || 'Материалы прикреплены'
        
        // Обновляем услугу в списке
        const index = services.value.findIndex(s => s.id === input.serviceId)
        if (index !== -1 && services.value[index].materials) {
          services.value[index].materials = serviceWithMaterials.materials
        }
        
        return serviceWithMaterials
      } else {
        const errorMsg = response.data?.attachMaterialsToService?.error || response.data?.attachMaterialsToService?.message || 'Ошибка прикрепления материалов'
        attachMaterialsToServiceApiData.value.error = true
        attachMaterialsToServiceApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка прикрепления материалов'
      attachMaterialsToServiceApiData.value.error = true
      attachMaterialsToServiceApiData.value.message = errorMessage
      return null
    } finally {
      attachMaterialsToServiceApiData.value.loading = false
    }
  }

  // Удалить материал из услуги
  const removeMaterialFromServiceAction = async (input: RemoveMaterialFromServiceInput): Promise<Service | null> => {
    resetApiState(removeMaterialFromServiceApiData.value)
    removeMaterialFromServiceApiData.value.loading = true

    try {
      const response = await removeMaterialFromService(input)

      if (response.data?.removeMaterialFromService?.successfully && response.data.removeMaterialFromService.data) {
        const serviceWithMaterials = response.data.removeMaterialFromService.data as any
        removeMaterialFromServiceApiData.value.data = serviceWithMaterials
        removeMaterialFromServiceApiData.value.success = true
        removeMaterialFromServiceApiData.value.message = response.data.removeMaterialFromService.message || 'Материал удален'
        
        // Обновляем услугу в списке
        const index = services.value.findIndex(s => s.id === input.serviceId)
        if (index !== -1 && services.value[index].materials) {
          services.value[index].materials = serviceWithMaterials.materials
        }
        
        return serviceWithMaterials
      } else {
        const errorMsg = response.data?.removeMaterialFromService?.error || response.data?.removeMaterialFromService?.message || 'Ошибка удаления материала'
        removeMaterialFromServiceApiData.value.error = true
        removeMaterialFromServiceApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления материала'
      removeMaterialFromServiceApiData.value.error = true
      removeMaterialFromServiceApiData.value.message = errorMessage
      return null
    } finally {
      removeMaterialFromServiceApiData.value.loading = false
    }
  }

  return {
    // State
    services,
    currentService,
    
    // API States
    getServicesApiData,
    getServiceApiData,
    createServiceApiData,
    updateServiceApiData,
    deleteServiceApiData,
    attachTagsToServiceApiData,
    removeTagFromServiceApiData,
    attachMaterialsToServiceApiData,
    removeMaterialFromServiceApiData,
    
    // Getters
    servicesGetters,
    currentServiceGetters,
    
    // API Data Getters
    getServicesApiDataGetters,
    getServiceApiDataGetters,
    createServiceApiDataGetters,
    updateServiceApiDataGetters,
    deleteServiceApiDataGetters,
    attachTagsToServiceApiDataGetters,
    removeTagFromServiceApiDataGetters,
    attachMaterialsToServiceApiDataGetters,
    removeMaterialFromServiceApiDataGetters,
    
    // Actions
    fetchServices,
    fetchService,
    createServiceAction,
    updateServiceAction,
    deleteServiceAction,
    attachTagsToServiceAction,
    removeTagFromServiceAction,
    attachMaterialsToServiceAction,
    removeMaterialFromServiceAction
  }
})
