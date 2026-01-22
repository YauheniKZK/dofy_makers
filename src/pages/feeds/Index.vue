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
    'feeds-main': 0
  },
  defaultDirection: 'forward' as const
}
</script>

<style scoped></style>