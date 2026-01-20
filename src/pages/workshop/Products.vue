<template>
  <div class="flex flex-col grow gap-6 p-4">
    <BackHeader i18n-key="products_title" />
    <div class="flex flex-col gap-4">
      <n-float-button
        :right="16"
        :bottom="90"
        :square="true"
        width="56"
        height="56"
        class="float-button"
        :class="{ 'float-button-enter': showFloatButton }"
      >
        <n-icon :size="32">
          <Add @click="showModalAddProduct = true" />
        </n-icon>
      </n-float-button>
    </div>

    <!-- Список товаров -->
    <div v-if="!productStore.getProductsApiDataGetters.loading && products.length > 0" class="flex flex-col gap-4">
      <div
        v-for="product in products"
        :key="product.id"
        class="flex flex-col gap-2 p-4 bg-[#f6f8f7] rounded-lg"
      >
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1 flex-1">
            <h3 class="text-base font-semibold">{{ product.name }}</h3>
            <p v-if="product.description" class="text-sm text-[#868686] line-clamp-2">{{ product.description }}</p>
            <div v-if="product.subcategory" class="text-xs text-[#868686]">{{ product.subcategory.name }}</div>
          </div>
        </div>
        
        <!-- Изображения -->
        <div v-if="product.images && product.images.length > 0" class="flex gap-2 mt-2 overflow-x-auto">
          <img
            v-for="(image, index) in product.images.slice(0, 3)"
            :key="index"
            :src="image"
            :alt="product.name"
            class="w-20 h-20 object-cover rounded"
          />
        </div>

        <!-- Информация о товаре -->
        <div class="flex items-center justify-between mt-2">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-1 text-sm font-semibold">
              <span>{{ product.price }}</span>
              <span>{{ product.currency }}</span>
            </div>
            <div v-if="product.productType === 'BUNDLE'" class="px-2 py-1 bg-blue-100 rounded text-xs text-blue-700">
              {{ $t('product_type_bundle') }}
            </div>
            <div v-if="product.favoritesCount !== undefined && product.favoritesCount > 0" class="flex items-center gap-1 text-sm text-[#868686]">
              <span>{{ product.favoritesCount }}</span>
              <span>★</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <div class="flex items-center gap-1">
              <span :class="product.isActive ? 'text-green-500' : 'text-gray-400'" class="text-xs">
                {{ product.isActive ? $t('user_status_active') : $t('user_status_inactive') }}
              </span>
            </div>
            <div class="flex items-center gap-1">
              <span :class="product.isPublished ? 'text-blue-500' : 'text-gray-400'" class="text-xs">
                {{ product.isPublished ? 'Опубликован' : 'Черновик' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Информация о товарах в наборе -->
        <div v-if="product.productType === 'BUNDLE' && product.bundleItems && product.bundleItems.length > 0" class="mt-2 p-2 bg-white rounded">
          <div class="text-xs text-[#868686] mb-1">{{ $t('bundle_items_count', { count: product.bundleItems.length }) }}</div>
          <div class="flex flex-col gap-1">
            <div
              v-for="(item, index) in product.bundleItems.slice(0, 3)"
              :key="index"
              class="text-xs text-[#868686]"
            >
              • {{ item.product.name }} <span v-if="item.quantity > 1">(x{{ item.quantity }})</span>
            </div>
            <div v-if="product.bundleItems.length > 3" class="text-xs text-[#868686]">
              ... и еще {{ product.bundleItems.length - 3 }}
            </div>
          </div>
        </div>

        <!-- Теги и материалы -->
        <div v-if="(product.tags && product.tags.length > 0) || (product.materials && product.materials.length > 0)" class="flex flex-wrap gap-2 mt-2">
          <template v-if="product.tags && product.tags.length > 0">
            <div
              v-for="tag in product.tags.slice(0, 3)"
              :key="tag.id"
              class="px-2 py-1 bg-white rounded text-xs text-[#868686]"
            >
              {{ tag.name }}
            </div>
          </template>
          <template v-if="product.materials && product.materials.length > 0">
            <div
              v-for="material in product.materials.slice(0, 3)"
              :key="material.id"
              class="px-2 py-1 bg-white rounded text-xs text-[#868686]"
            >
              {{ material.name }}
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-if="!productStore.getProductsApiDataGetters.loading && products.length === 0" class="flex flex-col items-center justify-center gap-4 py-12">
      <p class="text-base text-[#868686]">{{ $t('empty_product_description') }}</p>
      <p class="text-sm text-[#868686]">{{ $t('products_description') }}</p>
    </div>

    <!-- Загрузка -->
    <div v-if="productStore.getProductsApiDataGetters.loading" class="flex items-center justify-center py-12">
      <n-spin size="large" />
    </div>

    <Drawer :showModal="showModalAddProduct" @close="handleClose" height="95%" isShowCloseButton>
      <template #content>
        <AddProduct />
      </template>
    </Drawer>
  </div>
</template>

<style scoped>
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

<script setup lang="ts">
import { NIcon, NFloatButton, NSpin } from 'naive-ui'
import { Add } from '@vicons/carbon'
import Drawer from '@/components/ui/Drawer.vue'
import { ref, computed, onMounted, watch } from 'vue'
import AddProduct from './components/products/AddProduct.vue'
import BackHeader from '@/components/BackHeader.vue'
import { useProductStore } from '@/stores/product'
import { useUserStore } from '@/stores/user'

const productStore = useProductStore()
const userStore = useUserStore()

const showModalAddProduct = ref(false)
const showFloatButton = ref(false)

const products = computed(() => productStore.productsGetters)

const handleClose = () => {
  showModalAddProduct.value = false
}

onMounted(async () => {
  setTimeout(() => {
    showFloatButton.value = true
  }, 200)

  // Загружаем товары текущего пользователя
  if (userStore.currentUserGetters?.id) {
    await productStore.fetchProducts({
      userId: userStore.currentUserGetters.id
    })
  }
})

// Перезагружаем товары после успешного создания
watch(() => productStore.createProductApiDataGetters.success, (success) => {
  if (success && userStore.currentUserGetters?.id) {
    productStore.fetchProducts({
      userId: userStore.currentUserGetters.id
    })
    showModalAddProduct.value = false
  }
})
</script>