<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { NCard, NAlert } from 'naive-ui'

const router = useRouter()
const userStore = useUserStore()
const { currentUserGetters, isBlocked, blockReasons } = storeToRefs(userStore)

const blockMessage = computed(() => {
  if (!blockReasons.value || blockReasons.value.length === 0) {
    return ''
  }
  const reasons = blockReasons.value
    .map(reason => `• ${reason.description || reason.name}`)
    .join('\n')
  return `Ваш аккаунт заблокирован.\n\nПричины блокировки:\n${reasons}`
})

onMounted(() => {
  // Если пользователь заблокирован, перенаправляем на стартовую страницу
  if (isBlocked.value) {
    router.push('/')
  }
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full p-4">
    <div v-if="isBlocked" class="max-w-md w-full">
      <n-alert type="error" title="Аккаунт заблокирован">
        <pre class="whitespace-pre-wrap">{{ blockMessage }}</pre>
      </n-alert>
    </div>
    <div v-else class="flex flex-col items-center justify-center h-full text-amber-950">
      {{ 'Dashboard' }}
    </div>
  </div>
</template>

<style scoped></style>
