
<template>
  <n-layout-header 
    class="header-minimal"
    style="height: 56px; padding: 0 20px" 
    bordered 
    :position="'absolute'"
  >
    <div class="flex items-center justify-between h-full">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
          <span class="text-white text-sm font-bold">D</span>
        </div>
        <span class="text-sm font-medium text-gray-700 hidden sm:block">DofyMaster</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right hidden sm:block">
          <div class="text-sm font-medium text-gray-900">{{ currentUserGetters?.name || 'Пользователь' }}</div>
          <div v-if="currentUserGetters?.role" class="text-xs text-gray-500">
            {{ currentUserGetters.role.name }}
          </div>
        </div>
        <div class="w-8 h-8 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
          <span class="text-white text-xs font-semibold">
            {{ getInitials(currentUserGetters?.name) }}
          </span>
        </div>
      </div>
    </div>
  </n-layout-header>
</template>

<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import {
  NLayoutHeader
} from 'naive-ui'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

const { currentUserGetters } = storeToRefs(userStore)

const getInitials = (name: string | null | undefined) => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name[0].toUpperCase()
}
</script>

<style scoped>
.header-minimal {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.05);
}
</style>
