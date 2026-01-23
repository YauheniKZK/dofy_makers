<template>
  <div class="flex flex-col gap-6">
    <div v-if="loading" class="flex justify-center p-4">
      <n-spin size="large" />
    </div>
    
    <div v-else-if="error" class="flex justify-center p-4">
      <n-alert type="error" :title="$t('error')">
        {{ error }}
      </n-alert>
    </div>
    
    <div v-else-if="!hasRecommendations" class="flex justify-center p-4">
      <n-empty :description="$t('no_recommendations')" />
    </div>
    
    <div v-else class="flex flex-col gap-6">
      <!-- Товары -->
      <div v-if="autoRecommendations?.products && autoRecommendations.products.length > 0" class="flex flex-col gap-3">
        <h2 class="text-xl font-bold">{{ $t('recommended_products') }}</h2>
        <n-scrollbar x-scrollable>
          <div class="flex gap-4 pb-2">
            <AutoRecommendationItem
              v-for="product in autoRecommendations.products"
              :key="product.id"
              type="PRODUCT"
              :product="product"
            />
          </div>
        </n-scrollbar>
      </div>
      
      <!-- Услуги -->
      <div v-if="autoRecommendations?.services && autoRecommendations.services.length > 0" class="flex flex-col gap-3">
        <h2 class="text-xl font-bold">{{ $t('recommended_services') }}</h2>
        <n-scrollbar x-scrollable>
          <div class="flex gap-4 pb-2">
            <AutoRecommendationItem
              v-for="service in autoRecommendations.services"
              :key="service.id"
              type="SERVICE"
              :service="service"
            />
          </div>
        </n-scrollbar>
      </div>
      
      <!-- Мастера -->
      <div v-if="autoRecommendations?.masters && autoRecommendations.masters.length > 0" class="flex flex-col gap-3">
        <h2 class="text-xl font-bold">{{ $t('recommended_masters') }}</h2>
        <n-scrollbar x-scrollable>
          <div class="flex gap-4 pb-2">
            <AutoRecommendationItem
              v-for="master in autoRecommendations.masters"
              :key="master.id"
              type="MASTER"
              :master="master"
            />
          </div>
        </n-scrollbar>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { NSpin, NAlert, NEmpty, NScrollbar } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import { useRecommendationStore } from '@/stores/recommendation'
import AutoRecommendationItem from './AutoRecommendationItem.vue'

const { t } = useI18n()
const recommendationStore = useRecommendationStore()

const loading = computed(() => recommendationStore.getAutoRecommendationsApiDataGetters.loading)
const error = computed(() => {
  const apiData = recommendationStore.getAutoRecommendationsApiDataGetters
  return apiData.error ? (apiData.message || t('error_loading_recommendations')) : null
})
const autoRecommendations = computed(() => recommendationStore.autoRecommendationsGetters)

const hasRecommendations = computed(() => {
  if (!autoRecommendations.value) return false
  const hasProducts = autoRecommendations.value.products && autoRecommendations.value.products.length > 0
  const hasServices = autoRecommendations.value.services && autoRecommendations.value.services.length > 0
  const hasMasters = autoRecommendations.value.masters && autoRecommendations.value.masters.length > 0
  return hasProducts || hasServices || hasMasters
})

const loadRecommendations = async () => {
  await recommendationStore.fetchAutoRecommendations({
    limit: 20
  })
}

onMounted(() => {
  loadRecommendations()
})
</script>
