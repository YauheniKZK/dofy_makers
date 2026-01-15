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
    'knowledge-main': 0,
    'manual': 1,
    'recipes': 1
  },
  defaultDirection: 'forward' as const
}
</script>

<style scoped></style>