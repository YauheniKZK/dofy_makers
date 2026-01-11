
<template>
  <n-layout-header 
    class="header-minimal"
    style="height: 56px; padding: 0 20px" 
    bordered 
    :position="'absolute'"
  >
    <div class="flex items-center justify-between h-full">
      <div class="flex items-center gap-2">
        <div class="header-logo">
          <span class="logo-text">D</span>
        </div>
        <span class="header-title">DofyMaster</span>
      </div>
      <div class="flex items-center gap-3">
        <div class="text-right hidden sm:block">
          <div class="user-name">{{ currentUserGetters?.name || 'Пользователь' }}</div>
          <div v-if="currentUserGetters?.role" class="user-role">
            {{ currentUserGetters.role.name }}
          </div>
        </div>
        <div class="header-avatar">
          <span class="avatar-text">
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
  background: #CFBB99;
  border-bottom: 2px solid #B5A082;
}

.header-logo {
  width: 32px;
  height: 32px;
  background: #354024;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #4C3E19;
}

.logo-text {
  color: #FFFFFF;
  font-size: 14px;
  font-weight: 700;
}

.header-title {
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
}

.user-name {
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
}

.user-role {
  font-size: 12px;
  color: #4C3E19;
}

.header-avatar {
  width: 32px;
  height: 32px;
  background: #354024;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #4C3E19;
}

.avatar-text {
  color: #FFFFFF;
  font-size: 12px;
  font-weight: 600;
}
</style>
