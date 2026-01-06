<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import BottomNavigation from '@/components/BottomNavigation.vue'

const route = useRoute()
const userStore = useUserStore()
const { currentUserGetters, isBlocked } = storeToRefs(userStore)

const showBottomNavigation = computed(() => {
  // Показываем навигацию только на страницах dashboard, если есть пользователь и он не заблокирован
  return !!currentUserGetters.value && !isBlocked.value && route.path.startsWith('/dashboard')
})
</script>

<template>
  <div class="flex flex-col grow relative">
    <RouterView 
      :class="[
        'flex flex-col grow',
        showBottomNavigation ? 'pb-16' : ''
      ]" 
    />
    <BottomNavigation v-if="showBottomNavigation" />
  </div>
</template>

<style scoped></style>
