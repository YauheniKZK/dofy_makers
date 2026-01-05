<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import WebApp from '@twa-dev/sdk'
import { useUserStore } from '@/stores/user'
import { NSpin, NCard, NButton, useMessage } from 'naive-ui'
import type { User } from '@/graphql/queries/get-authenticated-user'

const router = useRouter()
const userStore = useUserStore()
const message = useMessage()

const loading = ref(true)
const error = ref<string | null>(null)
const user = ref<User | null>(null)
const needsActivation = ref(false)

const checkUser = async () => {
  try {
    loading.value = true
    error.value = null

    // Проверяем наличие Telegram WebApp
    if (!WebApp) {
      error.value = 'Приложение должно быть запущено через Telegram'
      loading.value = false
      return
    }

    // Получаем telegramId из WebApp.initDataUnsafe.user.id
    const telegramId = WebApp.initDataUnsafe?.user?.id?.toString()
    
    if (!telegramId) {
      error.value = 'Не удалось получить Telegram ID'
      loading.value = false
      return
    }

    // Ищем пользователя по telegramId
    const foundUser = await userStore.getUserByTelegramIdAction(telegramId)
    
    if (!foundUser) {
      error.value = 'Пользователь не найден. Обратитесь к администратору.'
      loading.value = false
      return
    }

    user.value = foundUser

    // Проверяем поле activated
    if (!foundUser.activated) {
      needsActivation.value = true
      loading.value = false
      return
    }

    // Если пользователь активирован, сохраняем его и переходим на главную
    userStore.setUser(foundUser)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err?.message || 'Произошла ошибка при проверке пользователя'
    loading.value = false
  }
}

const handleActivate = async () => {
  if (!user.value) return

  try {
    loading.value = true
    await userStore.activateUserAction(user.value.id)
    
    if (userStore.activateUserApiDataGetters.success) {
      message.success('Пользователь успешно активирован')
      user.value.activated = true
      needsActivation.value = false
      userStore.setUser(user.value)
      router.push('/dashboard')
    } else {
      message.error(userStore.activateUserApiDataGetters.message || 'Ошибка активации')
    }
  } catch (err: any) {
    message.error(err?.message || 'Ошибка активации пользователя')
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  checkUser()
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full p-4">
    <n-spin :show="loading">
      <div v-if="error" class="max-w-md w-full">
        <n-card title="Ошибка">
          <p class="text-red-500">{{ error }}</p>
        </n-card>
      </div>
      
      <div v-else-if="needsActivation && user" class="max-w-md w-full">
        <n-card title="Требуется активация">
          <div class="flex flex-col gap-4">
            <p>Добро пожаловать, {{ user.name }}!</p>
            <p>Ваш аккаунт требует активации. Нажмите кнопку ниже для активации.</p>
            <n-button
              type="primary"
              :loading="loading"
              @click="handleActivate"
              block
            >
              Активировать аккаунт
            </n-button>
          </div>
        </n-card>
      </div>
      
      <div v-else class="max-w-md w-full">
        <n-card>
          <p>Загрузка...</p>
        </n-card>
      </div>
    </n-spin>
  </div>
</template>

<style scoped></style>

