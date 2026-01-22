<template>
  <div class="flex flex-col gap-4 px-4">
    <div class="flex items-center justify-between">
      <div v-if="hasLocation" class="flex items-center gap-2">
        <n-icon :size="24">
          <Location />
        </n-icon>
        <span class="text-sm">{{ locationText }}</span>
      </div>
      <div v-else class="flex items-center gap-2">
        <n-icon :size="24" color="#a7a4a4">
          <Location />
        </n-icon>
        <span class="text-sm text-[#a7a4a4]">Адрес не указан</span>
      </div>
      <n-button text @click="handleEditLocation">
        <div class="flex items-center gap-2">
          <n-icon :size="14" color="#a7a4a4">
            <Edit />
          </n-icon>
          <span class="text-[#a7a4a4] text-sm">{{ hasLocation ? 'Изменить' : 'Добавить' }}</span>
        </div>
      </n-button>
    </div>

    <!-- Drawer для редактирования адреса -->
    <Drawer :showModal="showEditModal" @close="handleCloseModal" height="50%" isShowCloseButton>
      <template #content>
        <div class="flex flex-col gap-4 px-4">
          <h2 class="text-xl font-semibold">Редактирование адреса</h2>
          <n-form ref="formRef" :model="formData" :rules="rules">
            <n-form-item label="Страна" path="country">
              <n-select
                v-model:value="formData.country"
                :options="countryOptions"
                placeholder="Выберите страну"
                filterable
              />
            </n-form-item>
            <n-form-item label="Город" path="city">
              <n-input
                v-model:value="formData.city"
                placeholder="Введите город"
              />
            </n-form-item>
          </n-form>
          <div class="flex gap-2 justify-end">
            <n-button @click="handleCloseModal">Отменить</n-button>
            <n-button type="primary" :loading="userStore.updateUserApiDataGetters.loading" @click="handleSaveLocation">
              Сохранить
            </n-button>
          </div>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Location, Edit } from '@vicons/carbon'
import { NIcon, NButton, NForm, NFormItem, NInput, NSelect } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import Drawer from '@/components/ui/Drawer.vue'
import { useNotification } from '@/composables/useNotification'
import { CheckmarkCircle20Filled, ErrorCircle20Filled } from '@vicons/fluent'
import type { FormInst } from 'naive-ui'
import { allCountries } from 'country-region-data'

const listCountry = allCountries.map((e) => {
  return {
    label: e[0],
    value: e[1],
    listProvince: e[2].map((p) => {
      return {
        label: p[0],
        value: p[1]
      }
    })
  }
})

const countryOptions = computed(() => {
  return listCountry.map(country => ({
    label: country.label,
    value: country.value
  }))
})

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
const { showSuccess, showError } = useNotification()

const showEditModal = ref(false)
const formRef = ref<FormInst | null>(null)

const formData = ref({
  country: '',
  city: ''
})

const rules = {
  // Правила валидации можно добавить при необходимости
}

const hasLocation = computed(() => {
  return !!(currentUser.value?.country || currentUser.value?.city)
})

const locationText = computed(() => {
  const parts: string[] = []
  if (currentUser.value?.city) {
    parts.push(currentUser.value.city)
  }
  if (currentUser.value?.country) {
    // Находим название страны по коду
    const country = listCountry.find(c => c.value === currentUser.value?.country)
    parts.push(country ? country.label : currentUser.value.country)
  }
  return parts.join(', ') || ''
})

const handleEditLocation = () => {
  formData.value = {
    country: currentUser.value?.country || '',
    city: currentUser.value?.city || ''
  }
  showEditModal.value = true
}

const handleCloseModal = () => {
  showEditModal.value = false
  formData.value = {
    country: '',
    city: ''
  }
  formRef.value?.restoreValidation()
}

const handleSaveLocation = async () => {
  if (!formRef.value || !currentUser.value) return

  await formRef.value.validate((errors) => {
    if (errors) return
  }).catch(() => {})

  const result = await userStore.updateUserAction({
    userId: currentUser.value.id,
    country: formData.value.country || undefined,
    city: formData.value.city || undefined
  })

  if (result) {
    showSuccess(
      'Адрес обновлен',
      userStore.updateUserApiDataGetters.message || 'Адрес успешно обновлен',
      CheckmarkCircle20Filled
    )
    handleCloseModal()
    // Обновляем данные пользователя
    await userStore.fetchCurrentUser()
  } else {
    showError(
      'Ошибка обновления',
      userStore.updateUserApiDataGetters.message || 'Не удалось обновить адрес',
      ErrorCircle20Filled
    )
  }
}
</script>

<style scoped>
</style>