import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getFolders,
  getFolder,
  createFolder,
  updateFolder,
  deleteFolder,
  addProductToFolder,
  addProductsToFolder,
  addServiceToFolder,
  addServicesToFolder,
  removeProductFromFolder,
  removeServiceFromFolder
} from '@/graphql/services/folder'
import type { Folder } from '@/graphql/queries/get-folders'
import type { Folder as FolderDetail } from '@/graphql/queries/get-folder'
import type { CreateFolderInput } from '@/graphql/mutations/create-folder'
import type { UpdateFolderInput } from '@/graphql/mutations/update-folder'
import type { AddProductToFolderInput } from '@/graphql/mutations/add-product-to-folder'
import type { AddProductsToFolderInput } from '@/graphql/mutations/add-products-to-folder'
import type { AddServiceToFolderInput } from '@/graphql/mutations/add-service-to-folder'
import type { AddServicesToFolderInput } from '@/graphql/mutations/add-services-to-folder'
import type { RemoveProductFromFolderInput } from '@/graphql/mutations/remove-product-from-folder'
import type { RemoveServiceFromFolderInput } from '@/graphql/mutations/remove-service-from-folder'

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

export const useFolderStore = defineStore('folder', () => {
  // -----------------STATE---------------------
  const folders = ref<Folder[]>([])
  const currentFolder = ref<FolderDetail | null>(null)

  // Состояния для каждого API запроса
  const getFoldersApiData = ref<ApiState<{ folders: Folder[]; total: number }>>(createDefaultApiState<{ folders: Folder[]; total: number }>())
  const getFolderApiData = ref<ApiState<FolderDetail>>(createDefaultApiState<FolderDetail>())
  const createFolderApiData = ref<ApiState<Folder>>(createDefaultApiState<Folder>())
  const updateFolderApiData = ref<ApiState<Folder>>(createDefaultApiState<Folder>())
  const deleteFolderApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())
  const addProductToFolderApiData = ref<ApiState<Folder>>(createDefaultApiState<Folder>())
  const addProductsToFolderApiData = ref<ApiState<Folder>>(createDefaultApiState<Folder>())
  const addServiceToFolderApiData = ref<ApiState<Folder>>(createDefaultApiState<Folder>())
  const addServicesToFolderApiData = ref<ApiState<Folder>>(createDefaultApiState<Folder>())
  const removeProductFromFolderApiData = ref<ApiState<Folder>>(createDefaultApiState<Folder>())
  const removeServiceFromFolderApiData = ref<ApiState<Folder>>(createDefaultApiState<Folder>())

  // -----------------GETTERS---------------------
  const foldersGetters = computed(() => folders.value)
  const currentFolderGetters = computed(() => currentFolder.value)

  // Геттеры для API состояний
  const getFoldersApiDataGetters = computed(() => getFoldersApiData.value)
  const getFolderApiDataGetters = computed(() => getFolderApiData.value)
  const createFolderApiDataGetters = computed(() => createFolderApiData.value)
  const updateFolderApiDataGetters = computed(() => updateFolderApiData.value)
  const deleteFolderApiDataGetters = computed(() => deleteFolderApiData.value)
  const addProductToFolderApiDataGetters = computed(() => addProductToFolderApiData.value)
  const addProductsToFolderApiDataGetters = computed(() => addProductsToFolderApiData.value)
  const addServiceToFolderApiDataGetters = computed(() => addServiceToFolderApiData.value)
  const addServicesToFolderApiDataGetters = computed(() => addServicesToFolderApiData.value)
  const removeProductFromFolderApiDataGetters = computed(() => removeProductFromFolderApiData.value)
  const removeServiceFromFolderApiDataGetters = computed(() => removeServiceFromFolderApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список папок
  const fetchFolders = async (params?: { userId?: string; limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getFoldersApiData.value)
    getFoldersApiData.value.loading = true

    try {
      const response = await getFolders(params)

      if (response.data?.folders?.successfully && response.data.folders.data) {
        const data = response.data.folders.data
        folders.value = data.folders
        getFoldersApiData.value.data = data
        getFoldersApiData.value.success = true
        getFoldersApiData.value.message = response.data.folders.message || 'Папки загружены'
      } else {
        const errorMsg = response.data?.folders?.error || response.data?.folders?.message || 'Ошибка загрузки папок'
        getFoldersApiData.value.error = true
        getFoldersApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки папок'
      getFoldersApiData.value.error = true
      getFoldersApiData.value.message = errorMessage
    } finally {
      getFoldersApiData.value.loading = false
    }
  }

  // Получить папку по ID
  const fetchFolder = async (id: string): Promise<FolderDetail | null> => {
    resetApiState(getFolderApiData.value)
    getFolderApiData.value.loading = true

    try {
      const response = await getFolder(id)

      if (response.data?.folder?.successfully && response.data.folder.data) {
        const folder = response.data.folder.data
        currentFolder.value = folder
        getFolderApiData.value.data = folder
        getFolderApiData.value.success = true
        getFolderApiData.value.message = response.data.folder.message || 'Папка загружена'
        return folder
      } else {
        const errorMsg = response.data?.folder?.error || response.data?.folder?.message || 'Папка не найдена'
        getFolderApiData.value.error = true
        getFolderApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки папки'
      getFolderApiData.value.error = true
      getFolderApiData.value.message = errorMessage
      return null
    } finally {
      getFolderApiData.value.loading = false
    }
  }

  // Создать папку
  const createFolderAction = async (input: CreateFolderInput): Promise<Folder | null> => {
    resetApiState(createFolderApiData.value)
    createFolderApiData.value.loading = true

    try {
      const response = await createFolder(input)

      if (response.data?.createFolder?.successfully && response.data.createFolder.data) {
        const folder = response.data.createFolder.data as any
        createFolderApiData.value.data = folder
        createFolderApiData.value.success = true
        createFolderApiData.value.message = response.data.createFolder.message || 'Папка создана'
        
        // Добавляем в список папок
        folders.value.unshift(folder)
        
        return folder
      } else {
        const errorMsg = response.data?.createFolder?.error || response.data?.createFolder?.message || 'Ошибка создания папки'
        createFolderApiData.value.error = true
        createFolderApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка создания папки'
      createFolderApiData.value.error = true
      createFolderApiData.value.message = errorMessage
      return null
    } finally {
      createFolderApiData.value.loading = false
    }
  }

  // Обновить папку
  const updateFolderAction = async (input: UpdateFolderInput): Promise<Folder | null> => {
    resetApiState(updateFolderApiData.value)
    updateFolderApiData.value.loading = true

    try {
      const response = await updateFolder(input)

      if (response.data?.updateFolder?.successfully && response.data.updateFolder.data) {
        const updatedFolder = response.data.updateFolder.data as any
        updateFolderApiData.value.data = updatedFolder
        updateFolderApiData.value.success = true
        updateFolderApiData.value.message = response.data.updateFolder.message || 'Папка обновлена'
        
        // Обновляем в списке папок
        const index = folders.value.findIndex(f => f.id === input.folderId)
        if (index !== -1) {
          folders.value[index] = { ...folders.value[index], ...updatedFolder }
        }
        
        // Обновляем текущую папку
        if (currentFolder.value?.id === input.folderId) {
          currentFolder.value = { ...currentFolder.value, ...updatedFolder }
        }
        
        return updatedFolder
      } else {
        const errorMsg = response.data?.updateFolder?.error || response.data?.updateFolder?.message || 'Ошибка обновления папки'
        updateFolderApiData.value.error = true
        updateFolderApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка обновления папки'
      updateFolderApiData.value.error = true
      updateFolderApiData.value.message = errorMessage
      return null
    } finally {
      updateFolderApiData.value.loading = false
    }
  }

  // Удалить папку
  const deleteFolderAction = async (folderId: string): Promise<boolean> => {
    resetApiState(deleteFolderApiData.value)
    deleteFolderApiData.value.loading = true

    try {
      const response = await deleteFolder(folderId)

      if (response.data?.deleteFolder?.successfully) {
        deleteFolderApiData.value.data = true
        deleteFolderApiData.value.success = true
        deleteFolderApiData.value.message = response.data.deleteFolder.message || 'Папка удалена'
        
        // Удаляем из списка папок
        folders.value = folders.value.filter(f => f.id !== folderId)
        
        // Очищаем текущую папку, если это она
        if (currentFolder.value?.id === folderId) {
          currentFolder.value = null
        }
        
        return true
      } else {
        const errorMsg = response.data?.deleteFolder?.error || response.data?.deleteFolder?.message || 'Ошибка удаления папки'
        deleteFolderApiData.value.error = true
        deleteFolderApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления папки'
      deleteFolderApiData.value.error = true
      deleteFolderApiData.value.message = errorMessage
      return false
    } finally {
      deleteFolderApiData.value.loading = false
    }
  }

  // Добавить товар в папку
  const addProductToFolderAction = async (input: AddProductToFolderInput): Promise<Folder | null> => {
    resetApiState(addProductToFolderApiData.value)
    addProductToFolderApiData.value.loading = true

    try {
      const response = await addProductToFolder(input)

      if (response.data?.addProductToFolder?.successfully && response.data.addProductToFolder.data) {
        const folder = response.data.addProductToFolder.data as any
        addProductToFolderApiData.value.data = folder
        addProductToFolderApiData.value.success = true
        addProductToFolderApiData.value.message = response.data.addProductToFolder.message || 'Товар добавлен в папку'
        
        // Обновляем папку в списке
        const index = folders.value.findIndex(f => f.id === input.folderId)
        if (index !== -1) {
          folders.value[index] = { ...folders.value[index], ...folder }
        }
        
        // Обновляем текущую папку
        if (currentFolder.value?.id === input.folderId) {
          currentFolder.value = { ...currentFolder.value, ...folder }
        }
        
        return folder
      } else {
        const errorMsg = response.data?.addProductToFolder?.error || response.data?.addProductToFolder?.message || 'Ошибка добавления товара'
        addProductToFolderApiData.value.error = true
        addProductToFolderApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка добавления товара'
      addProductToFolderApiData.value.error = true
      addProductToFolderApiData.value.message = errorMessage
      return null
    } finally {
      addProductToFolderApiData.value.loading = false
    }
  }

  // Добавить несколько товаров в папку
  const addProductsToFolderAction = async (input: AddProductsToFolderInput): Promise<Folder | null> => {
    resetApiState(addProductsToFolderApiData.value)
    addProductsToFolderApiData.value.loading = true

    try {
      const response = await addProductsToFolder(input)

      if (response.data?.addProductsToFolder?.successfully && response.data.addProductsToFolder.data) {
        const folder = response.data.addProductsToFolder.data as any
        addProductsToFolderApiData.value.data = folder
        addProductsToFolderApiData.value.success = true
        addProductsToFolderApiData.value.message = response.data.addProductsToFolder.message || 'Товары добавлены в папку'
        
        // Обновляем папку в списке
        const index = folders.value.findIndex(f => f.id === input.folderId)
        if (index !== -1) {
          folders.value[index] = { ...folders.value[index], ...folder }
        }
        
        // Обновляем текущую папку
        if (currentFolder.value?.id === input.folderId) {
          currentFolder.value = { ...currentFolder.value, ...folder }
        }
        
        return folder
      } else {
        const errorMsg = response.data?.addProductsToFolder?.error || response.data?.addProductsToFolder?.message || 'Ошибка добавления товаров'
        addProductsToFolderApiData.value.error = true
        addProductsToFolderApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка добавления товаров'
      addProductsToFolderApiData.value.error = true
      addProductsToFolderApiData.value.message = errorMessage
      return null
    } finally {
      addProductsToFolderApiData.value.loading = false
    }
  }

  // Добавить услугу в папку
  const addServiceToFolderAction = async (input: AddServiceToFolderInput): Promise<Folder | null> => {
    resetApiState(addServiceToFolderApiData.value)
    addServiceToFolderApiData.value.loading = true

    try {
      const response = await addServiceToFolder(input)

      if (response.data?.addServiceToFolder?.successfully && response.data.addServiceToFolder.data) {
        const folder = response.data.addServiceToFolder.data as any
        addServiceToFolderApiData.value.data = folder
        addServiceToFolderApiData.value.success = true
        addServiceToFolderApiData.value.message = response.data.addServiceToFolder.message || 'Услуга добавлена в папку'
        
        // Обновляем папку в списке
        const index = folders.value.findIndex(f => f.id === input.folderId)
        if (index !== -1) {
          folders.value[index] = { ...folders.value[index], ...folder }
        }
        
        // Обновляем текущую папку
        if (currentFolder.value?.id === input.folderId) {
          currentFolder.value = { ...currentFolder.value, ...folder }
        }
        
        return folder
      } else {
        const errorMsg = response.data?.addServiceToFolder?.error || response.data?.addServiceToFolder?.message || 'Ошибка добавления услуги'
        addServiceToFolderApiData.value.error = true
        addServiceToFolderApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка добавления услуги'
      addServiceToFolderApiData.value.error = true
      addServiceToFolderApiData.value.message = errorMessage
      return null
    } finally {
      addServiceToFolderApiData.value.loading = false
    }
  }

  // Добавить несколько услуг в папку
  const addServicesToFolderAction = async (input: AddServicesToFolderInput): Promise<Folder | null> => {
    resetApiState(addServicesToFolderApiData.value)
    addServicesToFolderApiData.value.loading = true

    try {
      const response = await addServicesToFolder(input)

      if (response.data?.addServicesToFolder?.successfully && response.data.addServicesToFolder.data) {
        const folder = response.data.addServicesToFolder.data as any
        addServicesToFolderApiData.value.data = folder
        addServicesToFolderApiData.value.success = true
        addServicesToFolderApiData.value.message = response.data.addServicesToFolder.message || 'Услуги добавлены в папку'
        
        // Обновляем папку в списке
        const index = folders.value.findIndex(f => f.id === input.folderId)
        if (index !== -1) {
          folders.value[index] = { ...folders.value[index], ...folder }
        }
        
        // Обновляем текущую папку
        if (currentFolder.value?.id === input.folderId) {
          currentFolder.value = { ...currentFolder.value, ...folder }
        }
        
        return folder
      } else {
        const errorMsg = response.data?.addServicesToFolder?.error || response.data?.addServicesToFolder?.message || 'Ошибка добавления услуг'
        addServicesToFolderApiData.value.error = true
        addServicesToFolderApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка добавления услуг'
      addServicesToFolderApiData.value.error = true
      addServicesToFolderApiData.value.message = errorMessage
      return null
    } finally {
      addServicesToFolderApiData.value.loading = false
    }
  }

  // Удалить товар из папки
  const removeProductFromFolderAction = async (input: RemoveProductFromFolderInput): Promise<Folder | null> => {
    resetApiState(removeProductFromFolderApiData.value)
    removeProductFromFolderApiData.value.loading = true

    try {
      const response = await removeProductFromFolder(input)

      if (response.data?.removeProductFromFolder?.successfully && response.data.removeProductFromFolder.data) {
        const folder = response.data.removeProductFromFolder.data as any
        removeProductFromFolderApiData.value.data = folder
        removeProductFromFolderApiData.value.success = true
        removeProductFromFolderApiData.value.message = response.data.removeProductFromFolder.message || 'Товар удален из папки'
        
        // Обновляем папку в списке
        const index = folders.value.findIndex(f => f.id === input.folderId)
        if (index !== -1) {
          folders.value[index] = { ...folders.value[index], ...folder }
        }
        
        // Обновляем текущую папку
        if (currentFolder.value?.id === input.folderId) {
          currentFolder.value = { ...currentFolder.value, ...folder }
        }
        
        return folder
      } else {
        const errorMsg = response.data?.removeProductFromFolder?.error || response.data?.removeProductFromFolder?.message || 'Ошибка удаления товара'
        removeProductFromFolderApiData.value.error = true
        removeProductFromFolderApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления товара'
      removeProductFromFolderApiData.value.error = true
      removeProductFromFolderApiData.value.message = errorMessage
      return null
    } finally {
      removeProductFromFolderApiData.value.loading = false
    }
  }

  // Удалить услугу из папки
  const removeServiceFromFolderAction = async (input: RemoveServiceFromFolderInput): Promise<Folder | null> => {
    resetApiState(removeServiceFromFolderApiData.value)
    removeServiceFromFolderApiData.value.loading = true

    try {
      const response = await removeServiceFromFolder(input)

      if (response.data?.removeServiceFromFolder?.successfully && response.data.removeServiceFromFolder.data) {
        const folder = response.data.removeServiceFromFolder.data as any
        removeServiceFromFolderApiData.value.data = folder
        removeServiceFromFolderApiData.value.success = true
        removeServiceFromFolderApiData.value.message = response.data.removeServiceFromFolder.message || 'Услуга удалена из папки'
        
        // Обновляем папку в списке
        const index = folders.value.findIndex(f => f.id === input.folderId)
        if (index !== -1) {
          folders.value[index] = { ...folders.value[index], ...folder }
        }
        
        // Обновляем текущую папку
        if (currentFolder.value?.id === input.folderId) {
          currentFolder.value = { ...currentFolder.value, ...folder }
        }
        
        return folder
      } else {
        const errorMsg = response.data?.removeServiceFromFolder?.error || response.data?.removeServiceFromFolder?.message || 'Ошибка удаления услуги'
        removeServiceFromFolderApiData.value.error = true
        removeServiceFromFolderApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления услуги'
      removeServiceFromFolderApiData.value.error = true
      removeServiceFromFolderApiData.value.message = errorMessage
      return null
    } finally {
      removeServiceFromFolderApiData.value.loading = false
    }
  }

  return {
    // State
    folders,
    currentFolder,
    
    // API States
    getFoldersApiData,
    getFolderApiData,
    createFolderApiData,
    updateFolderApiData,
    deleteFolderApiData,
    addProductToFolderApiData,
    addProductsToFolderApiData,
    addServiceToFolderApiData,
    addServicesToFolderApiData,
    removeProductFromFolderApiData,
    removeServiceFromFolderApiData,
    
    // Getters
    foldersGetters,
    currentFolderGetters,
    
    // API Data Getters
    getFoldersApiDataGetters,
    getFolderApiDataGetters,
    createFolderApiDataGetters,
    updateFolderApiDataGetters,
    deleteFolderApiDataGetters,
    addProductToFolderApiDataGetters,
    addProductsToFolderApiDataGetters,
    addServiceToFolderApiDataGetters,
    addServicesToFolderApiDataGetters,
    removeProductFromFolderApiDataGetters,
    removeServiceFromFolderApiDataGetters,
    
    // Actions
    fetchFolders,
    fetchFolder,
    createFolderAction,
    updateFolderAction,
    deleteFolderAction,
    addProductToFolderAction,
    addProductsToFolderAction,
    addServiceToFolderAction,
    addServicesToFolderAction,
    removeProductFromFolderAction,
    removeServiceFromFolderAction
  }
})
