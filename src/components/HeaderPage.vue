<script setup lang="ts">
import { useUserStore } from '@/stores/user'
import {
  NLayoutHeader
} from 'naive-ui'
import { storeToRefs } from 'pinia'

const userStore = useUserStore()

const { currentUserGetters } = storeToRefs(userStore)

</script>

<template>
  <n-layout-header style="height: 64px; padding: 24px" bordered :position="'absolute'">
    <div class="flex items-center justify-between">
      <div></div>
      <div class="flex items-center gap-4">
        <span>{{ currentUserGetters?.name || 'Пользователь' }}</span>
        <span v-if="currentUserGetters?.role" class="text-sm text-gray-500">
          ({{ currentUserGetters.role.name }})
        </span>
      </div>
    </div>
  </n-layout-header>
</template>

<style scoped></style>
