<template>
  <div class="flex flex-col grow gap-6 p-4">
    <BackHeader :title="folderName" />
    
    <!-- Кнопка добавления элементов -->
    <div class="flex flex-col gap-4">
      <n-float-button
        v-if="folder"
        :right="16"
        :bottom="90"
        :square="true"
        width="56"
        height="56"
        class="float-button"
        :class="{ 'float-button-enter': showFloatButton }"
      >
        <n-icon :size="32">
          <Add @click="showDrawer = true" />
        </n-icon>
      </n-float-button>
    </div>
    
    <!-- Описание папки -->
    <div v-if="folder?.description" class="text-sm text-[#868686]">
      {{ folder.description }}
    </div>

    <!-- Загрузка -->
    <div v-if="folderStore.getFolderApiDataGetters.loading" class="flex items-center justify-center py-12">
      <n-spin size="large" />
    </div>

    <!-- Содержимое папки -->
    <div v-else-if="folder" class="flex flex-col gap-6">
      <!-- Товары -->
      <div v-if="folder.products && folder.products.length > 0" class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold">{{ $t('folder_products_count') }} ({{ folder.products.length }})</h3>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="product in folder.products"
            :key="product.id"
            class="flex flex-col gap-2 p-3 bg-[#f6f8f7] rounded-lg cursor-pointer"
            @click="() => handleProductClick(product.id)"
          >
            <div v-if="product.images && product.images.length > 0" class="w-full aspect-square rounded-lg overflow-hidden bg-white">
              <img :src="product.images[0]" :alt="product.name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-full aspect-square rounded-lg bg-white flex items-center justify-center">
              <n-icon size="32" class="text-[#868686]">
                <Image />
              </n-icon>
            </div>
            <h4 class="text-sm font-semibold line-clamp-2">{{ product.name }}</h4>
            <p v-if="product.description" class="text-xs text-[#868686] line-clamp-2">{{ product.description }}</p>
            <div class="flex items-center gap-1">
              <span class="text-sm font-semibold">{{ product.price }}</span>
              <span class="text-xs text-[#868686]">{{ product.currency }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Услуги -->
      <div v-if="folder.services && folder.services.length > 0" class="flex flex-col gap-4">
        <h3 class="text-lg font-semibold">{{ $t('folder_services_count') }} ({{ folder.services.length }})</h3>
        <div class="grid grid-cols-2 gap-4">
          <div
            v-for="service in folder.services"
            :key="service.id"
            class="flex flex-col gap-2 p-3 bg-[#f6f8f7] rounded-lg cursor-pointer"
            @click="() => handleServiceClick(service.id)"
          >
            <div v-if="service.images && service.images.length > 0" class="w-full aspect-square rounded-lg overflow-hidden bg-white">
              <img :src="service.images[0]" :alt="service.name" class="w-full h-full object-cover" />
            </div>
            <div v-else class="w-full aspect-square rounded-lg bg-white flex items-center justify-center">
              <n-icon size="32" class="text-[#868686]">
                <Image />
              </n-icon>
            </div>
            <h4 class="text-sm font-semibold line-clamp-2">{{ service.name }}</h4>
            <p v-if="service.description" class="text-xs text-[#868686] line-clamp-2">{{ service.description }}</p>
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

      <!-- Пустое состояние -->
      <div v-if="(!folder.products || folder.products.length === 0) && (!folder.services || folder.services.length === 0)" class="flex flex-col items-center justify-center gap-4 py-12">
        <p class="text-base text-[#868686]">{{ $t('folder_empty_content') }}</p>
      </div>
    </div>

    <!-- Ошибка загрузки -->
    <div v-else-if="folderStore.getFolderApiDataGetters.error" class="flex flex-col items-center justify-center gap-4 py-12">
      <p class="text-base text-red-500">{{ folderStore.getFolderApiDataGetters.message || $t('folder_error') }}</p>
    </div>

    <!-- Drawer для добавления элементов -->
    <Drawer :showModal="showDrawer" @close="handleCloseDrawer" height="95%" isShowCloseButton>
      <template #content>
        <AddItemsToFolder
          v-if="folder"
          :folder-id="folderId"
          :existing-product-ids="existingProductIds"
          :existing-service-ids="existingServiceIds"
          @added="handleItemsAdded"
        />
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { NSpin, NIcon, NFloatButton } from 'naive-ui'
import { Image, Add } from '@vicons/carbon'
import BackHeader from '@/components/BackHeader.vue'
import Drawer from '@/components/ui/Drawer.vue'
import AddItemsToFolder from './components/AddItemsToFolder.vue'
import { useFolderStore } from '@/stores/folder'
import type { Folder } from '@/graphql/queries/get-folder'

interface Props {
  id?: string
}

const props = defineProps<Props>()
const route = useRoute()
const router = useRouter()
const folderStore = useFolderStore()

const folder = computed(() => folderStore.currentFolderGetters as Folder | null)
const showDrawer = ref(false)
const showFloatButton = ref(false)

const folderName = computed(() => {
  return folder.value?.name || ''
})

// Получаем ID из props или из route params
const folderId = computed(() => {
  return props.id || (route.params.id as string) || ''
})

// Получаем ID уже добавленных товаров и услуг
const existingProductIds = computed(() => {
  return folder.value?.products?.map(p => p.id) || []
})

const existingServiceIds = computed(() => {
  return folder.value?.services?.map(s => s.id) || []
})

const handleProductClick = (productId: string) => {
  // Переход на страницу товара (можно добавить позже)
  // router.push(`/workshop/products/${productId}`)
}

const handleServiceClick = (serviceId: string) => {
  // Переход на страницу услуги (можно добавить позже)
  // router.push(`/workshop/services/${serviceId}`)
}

const handleCloseDrawer = () => {
  showDrawer.value = false
}

const handleItemsAdded = async () => {
  // Обновляем данные папки после добавления элементов
  if (folderId.value) {
    await folderStore.fetchFolder(folderId.value)
  }
}

onMounted(async () => {
  setTimeout(() => {
    showFloatButton.value = true
  }, 200)
  
  if (folderId.value) {
    await folderStore.fetchFolder(folderId.value)
  }
})

// Следим за изменением ID в роуте
watch(() => route.params.id, async (newId) => {
  if (newId && newId !== folderId.value) {
    await folderStore.fetchFolder(newId as string)
  }
})
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.float-button {
  opacity: 0;
  transform: translateX(100px);
  transition: none;
}

.float-button-enter {
  animation: slideInFromRight 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>
