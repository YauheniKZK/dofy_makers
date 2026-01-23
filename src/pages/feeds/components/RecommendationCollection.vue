<template>
  <div class="flex flex-col gap-3">
    <div class="flex flex-col gap-1">
      <h2 class="text-xl font-bold">{{ collection.name }}</h2>
      <p v-if="collection.description" class="text-sm text-gray-600">
        {{ collection.description }}
      </p>
    </div>
    
    <n-scrollbar x-scrollable>
      <div class="flex gap-4 pb-2">
        <RecommendationItem
          v-for="item in sortedItems"
          :key="item.id"
          :item="item"
        />
      </div>
    </n-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { NScrollbar } from 'naive-ui'
import type { RecommendationCollection, RecommendationItem as RecommendationItemType } from '@/graphql/queries/get-recommendation-collections'
import RecommendationItem from './RecommendationItem.vue'

interface Props {
  collection: RecommendationCollection
}

const props = defineProps<Props>()

const sortedItems = computed(() => {
  return [...props.collection.items].sort((a, b) => a.displayOrder - b.displayOrder)
})
</script>
