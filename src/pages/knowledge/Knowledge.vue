<template>
  <PageLayout>
    <template #content>
      <div class="flex flex-col grow gap-6">
        <div class="flex flex-col gap-2">
          <h1 class="text-2xl font-bold">{{ $t('knowledge_title') }}</h1>
          <p>{{ $t('knowledge_description') }}</p>
        </div>
        <div class="flex flex-col gap-4">
          <div
            v-for="item in menuItems"
            :key="item.key"
            class="flex flex-col gap-2"
          >
            <div class="flex items-center justify-between p-2 bg-[#f6f8f7] rounded-lg">
              <div class="flex items-center gap-2">
                <div class="flex justify-center items-center min-w-12 h-12 bg-white rounded-lg">
                  <n-icon size="24">
                    <component :is="item.icon" />
                  </n-icon>
                </div>
              
                <span>{{ item.label }}</span>
              </div>
              <n-icon size="16">
                <ChevronRight />
              </n-icon>
            </div>
          </div>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue'
import { Data2, ChevronRight } from '@vicons/carbon'
import { BookInformation20Regular } from '@vicons/fluent'
import { NIcon } from 'naive-ui'

const menuItems = [
  {
    icon: Data2,
    label: 'Справочник',
    key: 'knowledge'
  },
  {
    icon: BookInformation20Regular,
    label: 'Рецепты',
    key: 'recipes'
  }
]
</script>

<style scoped></style>