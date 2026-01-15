import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getMaterials,
  getMaterial,
  getMaterialGroups,
  getMaterialGroup
} from '@/graphql/services/material'
import type { Material } from '@/graphql/queries/get-materials'
import type { Material as MaterialFromGetMaterial } from '@/graphql/queries/get-material'
import type { MaterialGroup } from '@/graphql/queries/get-material-groups'

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

export const useMaterialStore = defineStore('material', () => {
  // -----------------STATE---------------------
  const materials = ref<Material[]>([])
  const currentMaterial = ref<Material | MaterialFromGetMaterial | null>(null)
  const materialGroups = ref<MaterialGroup[]>([])
  const currentMaterialGroup = ref<MaterialGroup | null>(null)

  // Состояния для каждого API запроса
  const getMaterialsApiData = ref<ApiState<Material[]>>(createDefaultApiState<Material[]>())
  const getMaterialApiData = ref<ApiState<Material | MaterialFromGetMaterial>>(createDefaultApiState<Material | MaterialFromGetMaterial>())
  const getMaterialGroupsApiData = ref<ApiState<MaterialGroup[]>>(createDefaultApiState<MaterialGroup[]>())
  const getMaterialGroupApiData = ref<ApiState<MaterialGroup>>(createDefaultApiState<MaterialGroup>())

  // -----------------GETTERS---------------------
  const materialsGetters = computed(() => materials.value)
  const currentMaterialGetters = computed(() => currentMaterial.value)
  const materialGroupsGetters = computed(() => materialGroups.value)
  const currentMaterialGroupGetters = computed(() => currentMaterialGroup.value)

  // Геттеры для API состояний
  const getMaterialsApiDataGetters = computed(() => getMaterialsApiData.value)
  const getMaterialApiDataGetters = computed(() => getMaterialApiData.value)
  const getMaterialGroupsApiDataGetters = computed(() => getMaterialGroupsApiData.value)
  const getMaterialGroupApiDataGetters = computed(() => getMaterialGroupApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список материалов
  const fetchMaterials = async (params?: { materialGroupId?: string; includeInactive?: boolean }): Promise<void> => {
    resetApiState(getMaterialsApiData.value)
    getMaterialsApiData.value.loading = true

    try {
      const response = await getMaterials(params)

      if (response.data?.materials?.successfully && response.data.materials.data) {
        const data = response.data.materials.data
        materials.value = data
        getMaterialsApiData.value.data = data
        getMaterialsApiData.value.success = true
        getMaterialsApiData.value.message = response.data.materials.message || 'Материалы загружены'
      } else {
        const errorMsg = response.data?.materials?.error || response.data?.materials?.message || 'Ошибка загрузки материалов'
        getMaterialsApiData.value.error = true
        getMaterialsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки материалов'
      getMaterialsApiData.value.error = true
      getMaterialsApiData.value.message = errorMessage
    } finally {
      getMaterialsApiData.value.loading = false
    }
  }

  // Получить материал по ID
  const fetchMaterial = async (id: string): Promise<Material | MaterialFromGetMaterial | null> => {
    resetApiState(getMaterialApiData.value)
    getMaterialApiData.value.loading = true

    try {
      const response = await getMaterial(id)

      if (response.data?.material?.successfully && response.data.material.data) {
        const material = response.data.material.data
        currentMaterial.value = material as Material
        getMaterialApiData.value.data = material
        getMaterialApiData.value.success = true
        getMaterialApiData.value.message = response.data.material.message || 'Материал загружен'
        return material
      } else {
        const errorMsg = response.data?.material?.error || response.data?.material?.message || 'Материал не найден'
        getMaterialApiData.value.error = true
        getMaterialApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки материала'
      getMaterialApiData.value.error = true
      getMaterialApiData.value.message = errorMessage
      return null
    } finally {
      getMaterialApiData.value.loading = false
    }
  }

  // Получить список групп материалов
  const fetchMaterialGroups = async (): Promise<void> => {
    resetApiState(getMaterialGroupsApiData.value)
    getMaterialGroupsApiData.value.loading = true

    try {
      const response = await getMaterialGroups()

      if (response.data?.materialGroups?.successfully && response.data.materialGroups.data) {
        const data = response.data.materialGroups.data
        materialGroups.value = data
        getMaterialGroupsApiData.value.data = data
        getMaterialGroupsApiData.value.success = true
        getMaterialGroupsApiData.value.message = response.data.materialGroups.message || 'Группы материалов загружены'
      } else {
        const errorMsg = response.data?.materialGroups?.error || response.data?.materialGroups?.message || 'Ошибка загрузки групп материалов'
        getMaterialGroupsApiData.value.error = true
        getMaterialGroupsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки групп материалов'
      getMaterialGroupsApiData.value.error = true
      getMaterialGroupsApiData.value.message = errorMessage
    } finally {
      getMaterialGroupsApiData.value.loading = false
    }
  }

  // Получить группу материалов по ID
  const fetchMaterialGroup = async (id: string): Promise<MaterialGroup | null> => {
    resetApiState(getMaterialGroupApiData.value)
    getMaterialGroupApiData.value.loading = true

    try {
      const response = await getMaterialGroup(id)

      if (response.data?.materialGroup?.successfully && response.data.materialGroup.data) {
        const materialGroup = response.data.materialGroup.data
        currentMaterialGroup.value = materialGroup
        getMaterialGroupApiData.value.data = materialGroup
        getMaterialGroupApiData.value.success = true
        getMaterialGroupApiData.value.message = response.data.materialGroup.message || 'Группа материалов загружена'
        return materialGroup
      } else {
        const errorMsg = response.data?.materialGroup?.error || response.data?.materialGroup?.message || 'Группа материалов не найдена'
        getMaterialGroupApiData.value.error = true
        getMaterialGroupApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки группы материалов'
      getMaterialGroupApiData.value.error = true
      getMaterialGroupApiData.value.message = errorMessage
      return null
    } finally {
      getMaterialGroupApiData.value.loading = false
    }
  }

  return {
    // State
    materials,
    currentMaterial,
    materialGroups,
    currentMaterialGroup,
    
    // API States
    getMaterialsApiData,
    getMaterialApiData,
    getMaterialGroupsApiData,
    getMaterialGroupApiData,
    
    // Getters
    materialsGetters,
    currentMaterialGetters,
    materialGroupsGetters,
    currentMaterialGroupGetters,
    
    // API Data Getters
    getMaterialsApiDataGetters,
    getMaterialApiDataGetters,
    getMaterialGroupsApiDataGetters,
    getMaterialGroupApiDataGetters,
    
    // Actions
    fetchMaterials,
    fetchMaterial,
    fetchMaterialGroups,
    fetchMaterialGroup
  }
})
