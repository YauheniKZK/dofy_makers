<template>
  <div class="flex flex-col grow gap-6 p-4">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold">{{ $t('workshop_title') }}</h1>
      <p>{{ $t('workshop_description') }}</p>
    </div>
    <Recommend />
    <MenuGroup :items="menuItems" />
  </div>
</template>

<script setup lang="ts">
import { Workspace, Cicsplex, SecurityServices, Folders } from '@vicons/carbon'
import MenuGroup from '@/components/MenuGroup.vue'
import { useI18n } from 'vue-i18n'
import { Toolbox16Regular } from '@vicons/fluent'
import Recommend from './components/Recommend.vue'

const { t } = useI18n()

const menuItems = [
  {
    title: t('products_title'),
    description: t('products_description'),
    items: [
      {
        icon: Workspace,
        label: t('products_title'),
        key: 'my-works',
        path: '/workshop/my-works',
        counter: 10
      },
      {
        icon: SecurityServices,
        label: t('services_title'),
        key: 'services',
        path: '/workshop/services',
        counter: 5
      },
      {
        icon: Folders,
        label: t('folders_title'),
        key: 'folders',
        path: '/workshop/folders'
      }
    ]
  },
  {
    title: t('tools_title'),
    description: t('tools_description'),
    items: [
      {
        icon: Toolbox16Regular,
        label: t('tools_title'),
        key: 'tools',
        path: '/workshop/tools'
      },
      {
        icon: Cicsplex,
        label: t('materials_title'),
        key: 'materials',
        path: '/workshop/materials'
      }
    ]
  }
]
</script>

<style scoped></style>