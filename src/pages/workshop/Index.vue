<template>
  <PageLayout>
    <template #content>
      <RouteTransition :config="transitionConfig" />
    </template>
  </PageLayout>
</template>

<script setup lang="ts">
import PageLayout from '@/layouts/PageLayout.vue'
import RouteTransition from '@/components/RouteTransition.vue'

// Конфигурация для определения направления переходов
const transitionConfig = {
  routeDepth: {
    'workshop-main': 0,
    'my-works': 1,
    'tools': 1,
    'materials': 1,
    'services': 1,
    'folders': 1,
  },
  defaultDirection: 'forward' as const
}
</script>

<style scoped></style>