<template>
  <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm min-w-[200px] border border-gray-100">
    <!-- Товар -->
    <div v-if="type === 'PRODUCT' && product" class="flex flex-col gap-2">
      <div v-if="product.images && product.images.length > 0" class="flex justify-center">
        <img
          :src="product.images[0]"
          :alt="product.name"
          class="w-full h-32 object-cover rounded"
        />
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="font-semibold text-base line-clamp-2">{{ product.name }}</h3>
        <p v-if="product.description" class="text-sm text-gray-600 line-clamp-2">
          {{ product.description }}
        </p>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-blue-600">
            {{ formatPrice(product.price, product.currency) }}
          </span>
          <span v-if="product.favoritesCount !== undefined" class="text-sm text-gray-500">
            ❤️ {{ product.favoritesCount }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Услуга -->
    <div v-else-if="type === 'SERVICE' && service" class="flex flex-col gap-2">
      <div v-if="service.images && service.images.length > 0" class="flex justify-center">
        <img
          :src="service.images[0]"
          :alt="service.name"
          class="w-full h-32 object-cover rounded"
        />
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="font-semibold text-base line-clamp-2">{{ service.name }}</h3>
        <p v-if="service.description" class="text-sm text-gray-600 line-clamp-2">
          {{ service.description }}
        </p>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-blue-600">
            {{ formatPrice(service.price, service.currency) }}
          </span>
          <div class="flex items-center gap-2">
            <span v-if="service.duration" class="text-sm text-gray-500">
              {{ formatDuration(service.duration) }}
            </span>
            <span v-if="service.favoritesCount !== undefined" class="text-sm text-gray-500">
              ❤️ {{ service.favoritesCount }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <!-- Мастер -->
    <div v-else-if="type === 'MASTER' && master" class="flex flex-col gap-2">
      <div class="flex justify-center">
        <n-avatar
          :size="64"
          :src="master.avatarUrl || undefined"
          round
        >
          {{ getInitials(master.name) }}
        </n-avatar>
      </div>
      <div class="text-center">
        <h3 class="font-semibold text-base">{{ master.name }}</h3>
        <p v-if="master.city" class="text-sm text-gray-600">
          {{ master.city }}
        </p>
      </div>
      <p v-if="master.shortDescription" class="text-sm text-gray-600 text-center line-clamp-2">
        {{ master.shortDescription }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAvatar } from 'naive-ui'
import type { Product } from '@/graphql/queries/get-products'
import type { Service } from '@/graphql/queries/get-services'
import type { Master } from '@/graphql/queries/get-recommendation-collections'

interface Props {
  type: 'PRODUCT' | 'SERVICE' | 'MASTER'
  product?: Product | null
  service?: Service | null
  master?: Master | null
}

defineProps<Props>()

const formatPrice = (price: number, currency: string) => {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: currency || 'RUB',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(price)
}

const formatDuration = (minutes: number) => {
  if (minutes < 60) {
    return `${minutes} мин`
  }
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  if (mins === 0) {
    return `${hours} ч`
  }
  return `${hours} ч ${mins} мин`
}

const getInitials = (name: string) => {
  const parts = name.split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase()
  }
  return name.charAt(0).toUpperCase()
}
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
