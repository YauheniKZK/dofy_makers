<template>
  <div class="flex flex-col gap-6 grow">
    <h2 class="text-xl font-semibold">{{ $t('folder_add_items') }}</h2>

    <!-- Табы для переключения между товарами и услугами -->
    <n-tabs v-model:value="activeTab" type="line">
      <n-tab-pane name="products" :tab="$t('folder_products_count')">
        <!-- Загрузка товаров -->
        <div v-if="productStore.getProductsApiDataGetters.loading" class="flex items-center justify-center py-12">
          <n-spin size="large" />
        </div>

        <!-- Список товаров -->
        <div v-else-if="availableProducts.length > 0" class="flex flex-col gap-3">
          <div
            v-for="product in availableProducts"
            :key="product.id"
            class="flex items-center gap-3 p-3 bg-[#f6f8f7] rounded-lg cursor-pointer"
            @click="toggleProduct(product.id)"
          >
            <n-checkbox :checked="selectedProducts.includes(product.id)" @update:checked="() => toggleProduct(product.id)" />
            <div v-if="product.images && product.images.length > 0" class="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
              <img :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-16 h-16 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <n-icon size="24" class="text-[#868686]">
                <Image />
              </n-icon>
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-0">
              <h4 class="text-sm font-semibold line-clamp-1">{{ product.name }}</h4>
              <p v-if="product.description" class="text-xs text-[#868686] line-clamp-1">{{ product.description }}</p>
              <div class="flex items-center gap-1">
                <span class="text-sm font-semibold">{{ product.price }}</span>
                <span class="text-xs text-[#868686]">{{ product.currency }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Пустое состояние для товаров -->
        <div v-else class="flex flex-col items-center justify-center gap-4 py-12">
          <p class="text-base text-[#868686]">{{ $t('folder_no_products') }}</p>
        </div>
      </n-tab-pane>

      <n-tab-pane name="services" :tab="$t('folder_services_count')">
        <!-- Загрузка услуг -->
        <div v-if="serviceStore.getServicesApiDataGetters.loading" class="flex items-center justify-center py-12">
          <n-spin size="large" />
        </div>

        <!-- Список услуг -->
        <div v-else-if="availableServices.length > 0" class="flex flex-col gap-3">
          <div
            v-for="service in availableServices"
            :key="service.id"
            class="flex items-center gap-3 p-3 bg-[#f6f8f7] rounded-lg cursor-pointer"
            @click="toggleService(service.id)"
          >
            <n-checkbox :checked="selectedServices.includes(service.id)" @update:checked="() => toggleService(service.id)" />
            <div v-if="service.images && service.images.length > 0" class="w-16 h-16 rounded-lg overflow-hidden bg-white flex-shrink-0">
              <img :src="service.images[0]" :alt="service.name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-16 h-16 rounded-lg bg-white flex items-center justify-center flex-shrink-0">
              <n-icon size="24" class="text-[#868686]">
                <Image />
              </n-icon>
            </div>
            <div class="flex flex-col gap-1 flex-1 min-w-0">
              <h4 class="text-sm font-semibold line-clamp-1">{{ service.name }}</h4>
              <p v-if="service.description" class="text-xs text-[#868686] line-clamp-1">{{ service.description }}</p>
              <div class="flex items-center gap-1">
                <span class="text-sm font-semibold">{{ service.price }}</span>
                <span class="text-xs text-[#868686]">{{ service.currency }}</span>
              </div>
              <div v-if="service.duration" class="text-xs text-[#868686]">
                {{ service.duration }} мин
              </div>
            </div>
          </div>
        </div>

        <!-- Пустое состояние для услуг -->
        <div v-else class="flex flex-col items-center justify-center gap-4 py-12">
          <p class="text-base text-[#868686]">{{ $t('folder_no_services') }}</p>
        </div>
      </n-tab-pane>
    </n-tabs>

    <!-- Кнопки действий -->
    <div class="flex gap-2 justify-end mt-auto pt-4 border-t">
      <n-button @click="$emit('close')">{{ $t('folder_cancel') }}</n-button>
      <n-button
        type="primary"
        :disabled="selectedProducts.length === 0 && selectedServices.length === 0"
        :loading="isAdding"
        @click="handleAddItems"
      >
        {{ $t('folder_add_selected') }} ({{ selectedProducts.length + selectedServices.length }})
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { NCheckbox, NSpin, NIcon, NTabs, NTabPane, NButton } from 'naive-ui'
import { Image } from '@vicons/carbon'
import { useProductStore } from '@/stores/product'
import { useServiceStore } from '@/stores/service'
import { useFolderStore } from '@/stores/folder'
import { useUserStore } from '@/stores/user'
import type { Product } from '@/graphql/queries/get-products'
import type { Service } from '@/graphql/queries/get-services'

interface Props {
  folderId: string
  existingProductIds?: string[]
  existingServiceIds?: string[]
}

const props = defineProps<Props>()
const emit = defineEmits<{
  close: []
  added: []
}>()

const productStore = useProductStore()
const serviceStore = useServiceStore()
const folderStore = useFolderStore()
const userStore = useUserStore()

const activeTab = ref<'products' | 'services'>('products')
const selectedProducts = ref<string[]>([])
const selectedServices = ref<string[]>([])
const isAdding = ref(false)

// Получаем товары пользователя, исключая уже добавленные в папку
const availableProducts = computed(() => {
  const products = productStore.productsGetters || []
  const existingIds = props.existingProductIds || []
  return products.filter(p => !existingIds.includes(p.id))
})

// Получаем услуги пользователя, исключая уже добавленные в папку
const availableServices = computed(() => {
  const services = serviceStore.servicesGetters || []
  const existingIds = props.existingServiceIds || []
  return services.filter(s => !existingIds.includes(s.id))
})

const toggleProduct = (productId: string) => {
  const index = selectedProducts.value.indexOf(productId)
  if (index > -1) {
    selectedProducts.value.splice(index, 1)
  } else {
    selectedProducts.value.push(productId)
  }
}

const toggleService = (serviceId: string) => {
  const index = selectedServices.value.indexOf(serviceId)
  if (index > -1) {
    selectedServices.value.splice(index, 1)
  } else {
    selectedServices.value.push(serviceId)
  }
}

const handleAddItems = async () => {
  if (selectedProducts.value.length === 0 && selectedServices.value.length === 0) return

  isAdding.value = true

  try {
    // Добавляем товары
    if (selectedProducts.value.length > 0) {
      if (selectedProducts.value.length === 1) {
        await folderStore.addProductToFolderAction({
          folderId: props.folderId,
          productId: selectedProducts.value[0]
        })
      } else {
        await folderStore.addProductsToFolderAction({
          folderId: props.folderId,
          productIds: selectedProducts.value
        })
      }
    }

    // Добавляем услуги
    if (selectedServices.value.length > 0) {
      if (selectedServices.value.length === 1) {
        await folderStore.addServiceToFolderAction({
          folderId: props.folderId,
          serviceId: selectedServices.value[0]
        })
      } else {
        await folderStore.addServicesToFolderAction({
          folderId: props.folderId,
          serviceIds: selectedServices.value
        })
      }
    }

    // Обновляем данные папки
    await folderStore.fetchFolder(props.folderId)
    
    // Очищаем выбранные элементы
    selectedProducts.value = []
    selectedServices.value = []
    
    emit('added')
  } catch (error) {
    console.error('Ошибка при добавлении элементов в папку:', error)
  } finally {
    isAdding.value = false
  }
}

onMounted(async () => {
  // Загружаем товары и услуги текущего пользователя
  const userId = userStore.currentUserGetters?.id
  if (userId) {
    await Promise.all([
      productStore.fetchProducts({ userId }),
      serviceStore.fetchServices({ userId })
    ])
  }
})
</script>

<style scoped>
.line-clamp-1 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
