import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import {
  getProducts,
  getProduct,
  getProductStages,
  getProductStage,
  createProduct,
  createBundleFromProducts,
  updateProduct,
  deleteProduct,
  attachTagsToProduct,
  removeTagFromProduct,
  attachMaterialsToProduct,
  removeMaterialFromProduct,
  createProductStage,
  updateProductStage,
  deleteProductStage
} from '@/graphql/services/product'
import type { Product } from '@/graphql/queries/get-products'
import type { ProductStage } from '@/graphql/queries/get-product-stages'
import type { CreateProductInput } from '@/graphql/mutations/create-product'
import type { CreateBundleFromProductsInput } from '@/graphql/mutations/create-bundle-from-products'
import type { UpdateProductInput } from '@/graphql/mutations/update-product'
import type { AttachTagsToProductInput } from '@/graphql/mutations/attach-tags-to-product'
import type { RemoveTagFromProductInput } from '@/graphql/mutations/remove-tag-from-product'
import type { AttachMaterialsToProductInput } from '@/graphql/mutations/attach-materials-to-product'
import type { RemoveMaterialFromProductInput } from '@/graphql/mutations/remove-material-from-product'
import type { CreateProductStageInput } from '@/graphql/mutations/create-product-stage'
import type { UpdateProductStageInput } from '@/graphql/mutations/update-product-stage'

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

export const useProductStore = defineStore('product', () => {
  // -----------------STATE---------------------
  const products = ref<Product[]>([])
  const currentProduct = ref<Product | null>(null)
  const productStages = ref<ProductStage[]>([])
  const currentProductStage = ref<ProductStage | null>(null)

  // Состояния для каждого API запроса
  const getProductsApiData = ref<ApiState<{ products: Product[]; total: number }>>(createDefaultApiState<{ products: Product[]; total: number }>())
  const getProductApiData = ref<ApiState<Product>>(createDefaultApiState<Product>())
  const getProductStagesApiData = ref<ApiState<ProductStage[]>>(createDefaultApiState<ProductStage[]>())
  const getProductStageApiData = ref<ApiState<ProductStage>>(createDefaultApiState<ProductStage>())
  const createProductApiData = ref<ApiState<Product>>(createDefaultApiState<Product>())
  const createBundleFromProductsApiData = ref<ApiState<Product>>(createDefaultApiState<Product>())
  const updateProductApiData = ref<ApiState<Product>>(createDefaultApiState<Product>())
  const deleteProductApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())
  const attachTagsToProductApiData = ref<ApiState<Product>>(createDefaultApiState<Product>())
  const removeTagFromProductApiData = ref<ApiState<Product>>(createDefaultApiState<Product>())
  const attachMaterialsToProductApiData = ref<ApiState<Product>>(createDefaultApiState<Product>())
  const removeMaterialFromProductApiData = ref<ApiState<Product>>(createDefaultApiState<Product>())
  const createProductStageApiData = ref<ApiState<ProductStage>>(createDefaultApiState<ProductStage>())
  const updateProductStageApiData = ref<ApiState<ProductStage>>(createDefaultApiState<ProductStage>())
  const deleteProductStageApiData = ref<ApiState<boolean>>(createDefaultApiState<boolean>())

  // -----------------GETTERS---------------------
  const productsGetters = computed(() => products.value)
  const currentProductGetters = computed(() => currentProduct.value)
  const productStagesGetters = computed(() => productStages.value)
  const currentProductStageGetters = computed(() => currentProductStage.value)

  // Геттеры для API состояний
  const getProductsApiDataGetters = computed(() => getProductsApiData.value)
  const getProductApiDataGetters = computed(() => getProductApiData.value)
  const getProductStagesApiDataGetters = computed(() => getProductStagesApiData.value)
  const getProductStageApiDataGetters = computed(() => getProductStageApiData.value)
  const createProductApiDataGetters = computed(() => createProductApiData.value)
  const createBundleFromProductsApiDataGetters = computed(() => createBundleFromProductsApiData.value)
  const updateProductApiDataGetters = computed(() => updateProductApiData.value)
  const deleteProductApiDataGetters = computed(() => deleteProductApiData.value)
  const attachTagsToProductApiDataGetters = computed(() => attachTagsToProductApiData.value)
  const removeTagFromProductApiDataGetters = computed(() => removeTagFromProductApiData.value)
  const attachMaterialsToProductApiDataGetters = computed(() => attachMaterialsToProductApiData.value)
  const removeMaterialFromProductApiDataGetters = computed(() => removeMaterialFromProductApiData.value)
  const createProductStageApiDataGetters = computed(() => createProductStageApiData.value)
  const updateProductStageApiDataGetters = computed(() => updateProductStageApiData.value)
  const deleteProductStageApiDataGetters = computed(() => deleteProductStageApiData.value)

  // -----------------ACTIONS---------------------

  // Получить список продуктов
  const fetchProducts = async (params?: { userId?: string; subcategoryId?: string; limit?: number; offset?: number }): Promise<void> => {
    resetApiState(getProductsApiData.value)
    getProductsApiData.value.loading = true

    try {
      const response = await getProducts(params)

      if (response.data?.products?.successfully && response.data.products.data) {
        const data = response.data.products.data
        products.value = data.products
        getProductsApiData.value.data = data
        getProductsApiData.value.success = true
        getProductsApiData.value.message = response.data.products.message || 'Продукты загружены'
      } else {
        const errorMsg = response.data?.products?.error || response.data?.products?.message || 'Ошибка загрузки продуктов'
        getProductsApiData.value.error = true
        getProductsApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки продуктов'
      getProductsApiData.value.error = true
      getProductsApiData.value.message = errorMessage
    } finally {
      getProductsApiData.value.loading = false
    }
  }

  // Получить продукт по ID
  const fetchProduct = async (id: string): Promise<Product | null> => {
    resetApiState(getProductApiData.value)
    getProductApiData.value.loading = true

    try {
      const response = await getProduct(id)

      if (response.data?.product?.successfully && response.data.product.data) {
        const product = response.data.product.data
        currentProduct.value = product
        getProductApiData.value.data = product
        getProductApiData.value.success = true
        getProductApiData.value.message = response.data.product.message || 'Продукт загружен'
        return product
      } else {
        const errorMsg = response.data?.product?.error || response.data?.product?.message || 'Продукт не найден'
        getProductApiData.value.error = true
        getProductApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки продукта'
      getProductApiData.value.error = true
      getProductApiData.value.message = errorMessage
      return null
    } finally {
      getProductApiData.value.loading = false
    }
  }

  // Получить список этапов продукта
  const fetchProductStages = async (productId: string): Promise<void> => {
    resetApiState(getProductStagesApiData.value)
    getProductStagesApiData.value.loading = true

    try {
      const response = await getProductStages(productId)

      if (response.data?.productStages?.successfully && response.data.productStages.data) {
        const stages = response.data.productStages.data
        productStages.value = stages
        getProductStagesApiData.value.data = stages
        getProductStagesApiData.value.success = true
        getProductStagesApiData.value.message = response.data.productStages.message || 'Этапы продукта загружены'
      } else {
        const errorMsg = response.data?.productStages?.error || response.data?.productStages?.message || 'Ошибка загрузки этапов продукта'
        getProductStagesApiData.value.error = true
        getProductStagesApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки этапов продукта'
      getProductStagesApiData.value.error = true
      getProductStagesApiData.value.message = errorMessage
    } finally {
      getProductStagesApiData.value.loading = false
    }
  }

  // Получить этап продукта по ID
  const fetchProductStage = async (id: string): Promise<ProductStage | null> => {
    resetApiState(getProductStageApiData.value)
    getProductStageApiData.value.loading = true

    try {
      const response = await getProductStage(id)

      if (response.data?.productStage?.successfully && response.data.productStage.data) {
        const stage = response.data.productStage.data
        currentProductStage.value = stage
        getProductStageApiData.value.data = stage
        getProductStageApiData.value.success = true
        getProductStageApiData.value.message = response.data.productStage.message || 'Этап продукта загружен'
        return stage
      } else {
        const errorMsg = response.data?.productStage?.error || response.data?.productStage?.message || 'Этап продукта не найден'
        getProductStageApiData.value.error = true
        getProductStageApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка загрузки этапа продукта'
      getProductStageApiData.value.error = true
      getProductStageApiData.value.message = errorMessage
      return null
    } finally {
      getProductStageApiData.value.loading = false
    }
  }

  // Создать продукт
  const createProductAction = async (input: CreateProductInput): Promise<Product | null> => {
    resetApiState(createProductApiData.value)
    createProductApiData.value.loading = true

    try {
      const response = await createProduct(input)

      if (response.data?.createProduct?.successfully && response.data.createProduct.data) {
        const product = response.data.createProduct.data as any
        createProductApiData.value.data = product
        createProductApiData.value.success = true
        createProductApiData.value.message = response.data.createProduct.message || 'Продукт создан'
        
        // Добавляем в список продуктов
        products.value.unshift(product)
        
        return product
      } else {
        const errorMsg = response.data?.createProduct?.error || response.data?.createProduct?.message || 'Ошибка создания продукта'
        createProductApiData.value.error = true
        createProductApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка создания продукта'
      createProductApiData.value.error = true
      createProductApiData.value.message = errorMessage
      return null
    } finally {
      createProductApiData.value.loading = false
    }
  }

  // Создать набор из существующих товаров
  const createBundleFromProductsAction = async (input: CreateBundleFromProductsInput): Promise<Product | null> => {
    resetApiState(createBundleFromProductsApiData.value)
    createBundleFromProductsApiData.value.loading = true

    try {
      const response = await createBundleFromProducts(input)

      if (response.data?.createBundleFromProducts?.successfully && response.data.createBundleFromProducts.data) {
        const bundle = response.data.createBundleFromProducts.data as any
        createBundleFromProductsApiData.value.data = bundle
        createBundleFromProductsApiData.value.success = true
        createBundleFromProductsApiData.value.message = response.data.createBundleFromProducts.message || 'Набор создан'
        
        // Добавляем в список продуктов
        products.value.unshift(bundle)
        
        return bundle
      } else {
        const errorMsg = response.data?.createBundleFromProducts?.error || response.data?.createBundleFromProducts?.message || 'Ошибка создания набора'
        createBundleFromProductsApiData.value.error = true
        createBundleFromProductsApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка создания набора'
      createBundleFromProductsApiData.value.error = true
      createBundleFromProductsApiData.value.message = errorMessage
      return null
    } finally {
      createBundleFromProductsApiData.value.loading = false
    }
  }

  // Обновить продукт
  const updateProductAction = async (input: UpdateProductInput): Promise<Product | null> => {
    resetApiState(updateProductApiData.value)
    updateProductApiData.value.loading = true

    try {
      const response = await updateProduct(input)

      if (response.data?.updateProduct?.successfully && response.data.updateProduct.data) {
        const updatedProduct = response.data.updateProduct.data as any
        updateProductApiData.value.data = updatedProduct
        updateProductApiData.value.success = true
        updateProductApiData.value.message = response.data.updateProduct.message || 'Продукт обновлен'
        
        // Обновляем в списке продуктов
        const index = products.value.findIndex(p => p.id === input.productId)
        if (index !== -1) {
          products.value[index] = { ...products.value[index], ...updatedProduct }
        }
        
        // Обновляем текущий продукт
        if (currentProduct.value?.id === input.productId) {
          currentProduct.value = { ...currentProduct.value, ...updatedProduct }
        }
        
        return updatedProduct
      } else {
        const errorMsg = response.data?.updateProduct?.error || response.data?.updateProduct?.message || 'Ошибка обновления продукта'
        updateProductApiData.value.error = true
        updateProductApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка обновления продукта'
      updateProductApiData.value.error = true
      updateProductApiData.value.message = errorMessage
      return null
    } finally {
      updateProductApiData.value.loading = false
    }
  }

  // Удалить продукт
  const deleteProductAction = async (productId: string): Promise<boolean> => {
    resetApiState(deleteProductApiData.value)
    deleteProductApiData.value.loading = true

    try {
      const response = await deleteProduct(productId)

      if (response.data?.deleteProduct?.successfully) {
        deleteProductApiData.value.data = true
        deleteProductApiData.value.success = true
        deleteProductApiData.value.message = response.data.deleteProduct.message || 'Продукт удален'
        
        // Удаляем из списка продуктов
        products.value = products.value.filter(p => p.id !== productId)
        
        // Очищаем текущий продукт, если это он
        if (currentProduct.value?.id === productId) {
          currentProduct.value = null
        }
        
        return true
      } else {
        const errorMsg = response.data?.deleteProduct?.error || response.data?.deleteProduct?.message || 'Ошибка удаления продукта'
        deleteProductApiData.value.error = true
        deleteProductApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления продукта'
      deleteProductApiData.value.error = true
      deleteProductApiData.value.message = errorMessage
      return false
    } finally {
      deleteProductApiData.value.loading = false
    }
  }

  // Прикрепить теги к продукту
  const attachTagsToProductAction = async (input: AttachTagsToProductInput): Promise<Product | null> => {
    resetApiState(attachTagsToProductApiData.value)
    attachTagsToProductApiData.value.loading = true

    try {
      const response = await attachTagsToProduct(input)

      if (response.data?.attachTagsToProduct?.successfully && response.data.attachTagsToProduct.data) {
        const productWithTags = response.data.attachTagsToProduct.data as any
        attachTagsToProductApiData.value.data = productWithTags
        attachTagsToProductApiData.value.success = true
        attachTagsToProductApiData.value.message = response.data.attachTagsToProduct.message || 'Теги прикреплены'
        
        // Обновляем продукт в списке
        const index = products.value.findIndex(p => p.id === input.productId)
        if (index !== -1 && products.value[index].tags) {
          products.value[index].tags = productWithTags.tags
        }
        
        return productWithTags
      } else {
        const errorMsg = response.data?.attachTagsToProduct?.error || response.data?.attachTagsToProduct?.message || 'Ошибка прикрепления тегов'
        attachTagsToProductApiData.value.error = true
        attachTagsToProductApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка прикрепления тегов'
      attachTagsToProductApiData.value.error = true
      attachTagsToProductApiData.value.message = errorMessage
      return null
    } finally {
      attachTagsToProductApiData.value.loading = false
    }
  }

  // Удалить тег из продукта
  const removeTagFromProductAction = async (input: RemoveTagFromProductInput): Promise<Product | null> => {
    resetApiState(removeTagFromProductApiData.value)
    removeTagFromProductApiData.value.loading = true

    try {
      const response = await removeTagFromProduct(input)

      if (response.data?.removeTagFromProduct?.successfully && response.data.removeTagFromProduct.data) {
        const productWithTags = response.data.removeTagFromProduct.data as any
        removeTagFromProductApiData.value.data = productWithTags
        removeTagFromProductApiData.value.success = true
        removeTagFromProductApiData.value.message = response.data.removeTagFromProduct.message || 'Тег удален'
        
        // Обновляем продукт в списке
        const index = products.value.findIndex(p => p.id === input.productId)
        if (index !== -1 && products.value[index].tags) {
          products.value[index].tags = productWithTags.tags
        }
        
        return productWithTags
      } else {
        const errorMsg = response.data?.removeTagFromProduct?.error || response.data?.removeTagFromProduct?.message || 'Ошибка удаления тега'
        removeTagFromProductApiData.value.error = true
        removeTagFromProductApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления тега'
      removeTagFromProductApiData.value.error = true
      removeTagFromProductApiData.value.message = errorMessage
      return null
    } finally {
      removeTagFromProductApiData.value.loading = false
    }
  }

  // Прикрепить материалы к продукту
  const attachMaterialsToProductAction = async (input: AttachMaterialsToProductInput): Promise<Product | null> => {
    resetApiState(attachMaterialsToProductApiData.value)
    attachMaterialsToProductApiData.value.loading = true

    try {
      const response = await attachMaterialsToProduct(input)

      if (response.data?.attachMaterialsToProduct?.successfully && response.data.attachMaterialsToProduct.data) {
        const productWithMaterials = response.data.attachMaterialsToProduct.data as any
        attachMaterialsToProductApiData.value.data = productWithMaterials
        attachMaterialsToProductApiData.value.success = true
        attachMaterialsToProductApiData.value.message = response.data.attachMaterialsToProduct.message || 'Материалы прикреплены'
        
        // Обновляем продукт в списке
        const index = products.value.findIndex(p => p.id === input.productId)
        if (index !== -1 && products.value[index].materials) {
          products.value[index].materials = productWithMaterials.materials
        }
        
        return productWithMaterials
      } else {
        const errorMsg = response.data?.attachMaterialsToProduct?.error || response.data?.attachMaterialsToProduct?.message || 'Ошибка прикрепления материалов'
        attachMaterialsToProductApiData.value.error = true
        attachMaterialsToProductApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка прикрепления материалов'
      attachMaterialsToProductApiData.value.error = true
      attachMaterialsToProductApiData.value.message = errorMessage
      return null
    } finally {
      attachMaterialsToProductApiData.value.loading = false
    }
  }

  // Удалить материал из продукта
  const removeMaterialFromProductAction = async (input: RemoveMaterialFromProductInput): Promise<Product | null> => {
    resetApiState(removeMaterialFromProductApiData.value)
    removeMaterialFromProductApiData.value.loading = true

    try {
      const response = await removeMaterialFromProduct(input)

      if (response.data?.removeMaterialFromProduct?.successfully && response.data.removeMaterialFromProduct.data) {
        const productWithMaterials = response.data.removeMaterialFromProduct.data as any
        removeMaterialFromProductApiData.value.data = productWithMaterials
        removeMaterialFromProductApiData.value.success = true
        removeMaterialFromProductApiData.value.message = response.data.removeMaterialFromProduct.message || 'Материал удален'
        
        // Обновляем продукт в списке
        const index = products.value.findIndex(p => p.id === input.productId)
        if (index !== -1 && products.value[index].materials) {
          products.value[index].materials = productWithMaterials.materials
        }
        
        return productWithMaterials
      } else {
        const errorMsg = response.data?.removeMaterialFromProduct?.error || response.data?.removeMaterialFromProduct?.message || 'Ошибка удаления материала'
        removeMaterialFromProductApiData.value.error = true
        removeMaterialFromProductApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления материала'
      removeMaterialFromProductApiData.value.error = true
      removeMaterialFromProductApiData.value.message = errorMessage
      return null
    } finally {
      removeMaterialFromProductApiData.value.loading = false
    }
  }

  // Создать этап продукта
  const createProductStageAction = async (input: CreateProductStageInput): Promise<ProductStage | null> => {
    resetApiState(createProductStageApiData.value)
    createProductStageApiData.value.loading = true

    try {
      const response = await createProductStage(input)

      if (response.data?.createProductStage?.successfully && response.data.createProductStage.data) {
        const stage = response.data.createProductStage.data as any
        createProductStageApiData.value.data = stage
        createProductStageApiData.value.success = true
        createProductStageApiData.value.message = response.data.createProductStage.message || 'Этап продукта создан'
        
        // Добавляем в список этапов
        productStages.value.push(stage)
        
        return stage
      } else {
        const errorMsg = response.data?.createProductStage?.error || response.data?.createProductStage?.message || 'Ошибка создания этапа продукта'
        createProductStageApiData.value.error = true
        createProductStageApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка создания этапа продукта'
      createProductStageApiData.value.error = true
      createProductStageApiData.value.message = errorMessage
      return null
    } finally {
      createProductStageApiData.value.loading = false
    }
  }

  // Обновить этап продукта
  const updateProductStageAction = async (input: UpdateProductStageInput): Promise<ProductStage | null> => {
    resetApiState(updateProductStageApiData.value)
    updateProductStageApiData.value.loading = true

    try {
      const response = await updateProductStage(input)

      if (response.data?.updateProductStage?.successfully && response.data.updateProductStage.data) {
        const updatedStage = response.data.updateProductStage.data as any
        updateProductStageApiData.value.data = updatedStage
        updateProductStageApiData.value.success = true
        updateProductStageApiData.value.message = response.data.updateProductStage.message || 'Этап продукта обновлен'
        
        // Обновляем в списке этапов
        const index = productStages.value.findIndex(s => s.id === input.stageId)
        if (index !== -1) {
          productStages.value[index] = { ...productStages.value[index], ...updatedStage }
        }
        
        // Обновляем текущий этап
        if (currentProductStage.value?.id === input.stageId) {
          currentProductStage.value = { ...currentProductStage.value, ...updatedStage }
        }
        
        return updatedStage
      } else {
        const errorMsg = response.data?.updateProductStage?.error || response.data?.updateProductStage?.message || 'Ошибка обновления этапа продукта'
        updateProductStageApiData.value.error = true
        updateProductStageApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка обновления этапа продукта'
      updateProductStageApiData.value.error = true
      updateProductStageApiData.value.message = errorMessage
      return null
    } finally {
      updateProductStageApiData.value.loading = false
    }
  }

  // Удалить этап продукта
  const deleteProductStageAction = async (stageId: string): Promise<boolean> => {
    resetApiState(deleteProductStageApiData.value)
    deleteProductStageApiData.value.loading = true

    try {
      const response = await deleteProductStage(stageId)

      if (response.data?.deleteProductStage?.successfully) {
        deleteProductStageApiData.value.data = true
        deleteProductStageApiData.value.success = true
        deleteProductStageApiData.value.message = response.data.deleteProductStage.message || 'Этап продукта удален'
        
        // Удаляем из списка этапов
        productStages.value = productStages.value.filter(s => s.id !== stageId)
        
        // Очищаем текущий этап, если это он
        if (currentProductStage.value?.id === stageId) {
          currentProductStage.value = null
        }
        
        return true
      } else {
        const errorMsg = response.data?.deleteProductStage?.error || response.data?.deleteProductStage?.message || 'Ошибка удаления этапа продукта'
        deleteProductStageApiData.value.error = true
        deleteProductStageApiData.value.message = errorMsg
        return false
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка удаления этапа продукта'
      deleteProductStageApiData.value.error = true
      deleteProductStageApiData.value.message = errorMessage
      return false
    } finally {
      deleteProductStageApiData.value.loading = false
    }
  }

  return {
    // State
    products,
    currentProduct,
    productStages,
    currentProductStage,
    
    // API States
    getProductsApiData,
    getProductApiData,
    getProductStagesApiData,
    getProductStageApiData,
    createProductApiData,
    createBundleFromProductsApiData,
    updateProductApiData,
    deleteProductApiData,
    attachTagsToProductApiData,
    removeTagFromProductApiData,
    attachMaterialsToProductApiData,
    removeMaterialFromProductApiData,
    createProductStageApiData,
    updateProductStageApiData,
    deleteProductStageApiData,
    
    // Getters
    productsGetters,
    currentProductGetters,
    productStagesGetters,
    currentProductStageGetters,
    
    // API Data Getters
    getProductsApiDataGetters,
    getProductApiDataGetters,
    getProductStagesApiDataGetters,
    getProductStageApiDataGetters,
    createProductApiDataGetters,
    createBundleFromProductsApiDataGetters,
    updateProductApiDataGetters,
    deleteProductApiDataGetters,
    attachTagsToProductApiDataGetters,
    removeTagFromProductApiDataGetters,
    attachMaterialsToProductApiDataGetters,
    removeMaterialFromProductApiDataGetters,
    createProductStageApiDataGetters,
    updateProductStageApiDataGetters,
    deleteProductStageApiDataGetters,
    
    // Actions
    fetchProducts,
    fetchProduct,
    fetchProductStages,
    fetchProductStage,
    createProductAction,
    createBundleFromProductsAction,
    updateProductAction,
    deleteProductAction,
    attachTagsToProductAction,
    removeTagFromProductAction,
    attachMaterialsToProductAction,
    removeMaterialFromProductAction,
    createProductStageAction,
    updateProductStageAction,
    deleteProductStageAction
  }
})
