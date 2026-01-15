<template>
  <div class="flex flex-col grow gap-6">
    <div class="flex flex-col gap-2 p-4 bg-[#155a5a]">
      <div class="flex items-center gap-4">
        <div class="flex">
          <n-avatar
            round
            :size="56"
            :src="userAvatar"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-white text-lg font-bold">{{ userName }}</span>
          <span v-if="userDescription && userDescription.length > 0" class="text-white text-sm">{{ userDescription }}</span>
          <n-button text>
            <div class="flex items-center gap-2">              
              <n-icon :size="14" color="#cfcfcf">
                <Edit />
              </n-icon>
              <span class="text-[#cfcfcf] text-sm">{{ $t('edit_description') }}</span>
            </div>
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { NAvatar, NButton, NIcon } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Edit } from '@vicons/carbon'
import { useTelegramUser } from '@/composables/useTelegramUser'

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

// Получаем данные из Telegram WebApp (включая аватар)
const { userAvatar: telegramAvatar, userFullName: telegramFullName } = useTelegramUser()

const userName = computed(() => {
  return currentUser.value?.name || telegramFullName.value || 'Unknown'
})

// Используем аватар из данных пользователя, если доступен, иначе из Telegram
const userAvatar = computed(() => {
  return currentUser.value?.avatarUrl || telegramAvatar.value || undefined
})

const userDescription = computed(() => {
  return currentUser.value?.description || ''
})
</script>