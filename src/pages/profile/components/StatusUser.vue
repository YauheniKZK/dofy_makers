<template>
  <div class="flex items-center gap-2">
    <div class="flex items-center gap-2">
      <n-icon :size="18" :color="status === UserStatus.ACTIVE ? '#008000' : '#a7a4a4'">
        <AiStatusComplete v-if="status === UserStatus.ACTIVE" />
        <AiStatusRejected v-else />
      </n-icon>
      <span class="text-sm" :class="statusTextClass">
        {{ statusText }}
      </span>
    </div>
    <n-button text @click="editStatus">
      <div class="flex items-center gap-2">              
        <n-icon :size="14" color="#a7a4a4">
          <Edit />
        </n-icon>
      </div>
    </n-button>
    <Drawer  :showModal="showEditStatusModal" @close="handleCloseModal">
      <template #content>
        <div class="flex flex-col gap-4 px-4">
          <h2 class="text-xl font-semibold">{{ t('edit_status_title') }}</h2>
          <n-radio-group 
            v-model:value="selectedStatus" 
            :disabled="isLoading"
          >
            <n-radio-button :value="UserStatus.ACTIVE" :disabled="isLoading">
              {{ t('user_status_active') }}
            </n-radio-button>
            <n-radio-button :value="UserStatus.INACTIVE" :disabled="isLoading">
              {{ t('user_status_inactive') }}
            </n-radio-button>
          </n-radio-group>
          <div class="flex gap-2 justify-end">
            <n-button @click="handleCloseModal" :disabled="isLoading">
              {{ t('folder_cancel') }}
            </n-button>
            <n-button 
              type="primary" 
              :loading="isLoading" 
              @click="handleUpdateStatus"
            >
              {{ t('folder_save') }}
            </n-button>
          </div>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { NButton, NIcon, NRadioGroup, NRadioButton } from 'naive-ui'
import { Edit, AiStatusComplete, AiStatusRejected } from '@vicons/carbon'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { UserStatus } from '@/graphql/interface'
import { useI18n } from 'vue-i18n'
import Drawer from '@/components/ui/Drawer.vue'
import { useNotification } from '@/composables/useNotification'
import { CheckmarkCircle20Filled, ErrorCircle20Filled } from '@vicons/fluent'

const { t } = useI18n()
const userStore = useUserStore()
const { currentUser, updateUserStatusApiDataGetters } = storeToRefs(userStore)
const { updateUserStatusAction } = userStore
const { showSuccess, showError } = useNotification()

const showEditStatusModal = ref(false)
const selectedStatus = ref<UserStatus>(UserStatus.ACTIVE)

const status = computed(() => {
  return currentUser.value?.status || UserStatus.ACTIVE
})

const isLoading = computed(() => {
  return updateUserStatusApiDataGetters.value.loading
})

const statusText = computed(() => {
  if (status.value === UserStatus.ACTIVE) {
    return t('user_status_active')
  }
  return t('user_status_inactive')
})

const statusClass = computed(() => {
  if (status.value === UserStatus.ACTIVE) {
    return 'bg-green-500'
  }
  return 'bg-gray-400'
})

const statusTextClass = computed(() => {
  if (status.value === UserStatus.ACTIVE) {
    return 'text-green-600'
  }
  return 'text-gray-500'
})

// Синхронизируем selectedStatus с текущим статусом при открытии модального окна
watch(showEditStatusModal, (isOpen) => {
  if (isOpen) {
    selectedStatus.value = status.value
  }
})

const editStatus = () => {  
  showEditStatusModal.value = true
}

const handleCloseModal = () => {
  showEditStatusModal.value = false
  selectedStatus.value = status.value
}

const handleUpdateStatus = async () => {
  if (!currentUser.value?.id) return
  
  const result = await updateUserStatusAction({ 
    userId: currentUser.value.id,
    status: selectedStatus.value
  })

  if (result) {
    showSuccess(
      t('user_status_updated_title', 'Статус обновлен'),
      updateUserStatusApiDataGetters.value.message || t('user_status_updated_message', 'Статус пользователя успешно обновлен'),
      CheckmarkCircle20Filled
    )
    handleCloseModal()
    // Обновляем данные пользователя
    await userStore.fetchCurrentUser()
  } else {
    showError(
      t('user_status_update_error_title', 'Ошибка обновления'),
      updateUserStatusApiDataGetters.value.message || t('user_status_update_error_message', 'Не удалось обновить статус пользователя'),
      ErrorCircle20Filled
    )
  }
}
</script>

<style scoped>
</style>
