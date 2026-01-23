<template>
  <div class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm min-w-[200px] border border-gray-100">
    <!-- Товар -->
    <div v-if="item.itemType === PRODUCT_TYPE && item.product" class="flex flex-col gap-2">
      <div v-if="item.product.images && item.product.images.length > 0" class="flex justify-center">
        <img
          :src="item.product.images[0]"
          :alt="item.product.name"
          class="w-full h-32 object-cover rounded"
        />
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="font-semibold text-base line-clamp-2">{{ item.product.name }}</h3>
        <p v-if="item.product.description" class="text-sm text-gray-600 line-clamp-2">
          {{ item.product.description }}
        </p>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-blue-600">
            {{ formatPrice(item.product.price, item.product.currency) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Услуга -->
    <div v-else-if="item.itemType === SERVICE_TYPE && item.service" class="flex flex-col gap-2">
      <div v-if="item.service.images && item.service.images.length > 0" class="flex justify-center">
        <img
          :src="item.service.images[0]"
          :alt="item.service.name"
          class="w-full h-32 object-cover rounded"
        />
      </div>
      <div class="flex flex-col gap-1">
        <h3 class="font-semibold text-base line-clamp-2">{{ item.service.name }}</h3>
        <p v-if="item.service.description" class="text-sm text-gray-600 line-clamp-2">
          {{ item.service.description }}
        </p>
        <div class="flex items-center justify-between">
          <span class="text-lg font-bold text-blue-600">
            {{ formatPrice(item.service.price, item.service.currency) }}
          </span>
          <span v-if="item.service.duration" class="text-sm text-gray-500">
            {{ formatDuration(item.service.duration) }}
          </span>
        </div>
      </div>
    </div>
    
    <!-- Мастер -->
    <div v-else-if="item.itemType === MASTER_TYPE && item.master" class="flex flex-col gap-2">
      <div class="flex justify-center">
        <n-avatar
          :size="64"
          :src="item.master.avatarUrl"
          round
        >
          {{ getInitials(item.master.name) }}
        </n-avatar>
      </div>
      <div class="text-center">
        <h3 class="font-semibold text-base">{{ item.master.name }}</h3>
        <p v-if="item.master.city" class="text-sm text-gray-600">
          {{ item.master.city }}
        </p>
      </div>
      <div v-if="item.master.specializations && item.master.specializations.length > 0" class="flex flex-wrap gap-1 justify-center">
        <n-tag
          v-for="spec in item.master.specializations.slice(0, 3)"
          :key="spec.id"
          size="small"
          type="info"
        >
          {{ spec.name }}
        </n-tag>
      </div>
      <p v-if="item.master.shortDescription" class="text-sm text-gray-600 text-center line-clamp-2">
        {{ item.master.shortDescription }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { NAvatar, NTag } from 'naive-ui'
import type { RecommendationItem, RecommendationItemType } from '@/graphql/queries/get-recommendation-collections'

interface Props {
  item: RecommendationItem
}

defineProps<Props>()

const PRODUCT_TYPE: RecommendationItemType = 'PRODUCT'
const SERVICE_TYPE: RecommendationItemType = 'SERVICE'
const MASTER_TYPE: RecommendationItemType = 'MASTER'

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
