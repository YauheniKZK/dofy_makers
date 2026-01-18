<template>
  <div class="flex flex-col grow gap-6 p-4">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold">{{ $t('knowledge_title') }}</h1>
      <p>{{ $t('knowledge_description') }}</p>
    </div>
    <MenuGroup :items="menuItems" />
  </div>
</template>

<script setup lang="ts">
import { Data2 } from '@vicons/carbon'
import { BookInformation20Regular } from '@vicons/fluent'
import MenuGroup from '@/components/MenuGroup.vue'

const menuItems = [
  {
    icon: Data2,
    label: 'Справочник',
    key: 'manual',
    path: '/knowledge/manual'
  },
  {
    icon: BookInformation20Regular,
    label: 'Рецепты',
    key: 'recipes',
    path: '/knowledge/recipes'
  }
]
</script>

<style scoped></style>