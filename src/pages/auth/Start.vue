<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import WebApp from '@twa-dev/sdk'
import { useUserStore } from '@/stores/user'
import { NSpin, NCard, NButton, useMessage, NForm, NFormItem, NInput } from 'naive-ui'
import type { User } from '@/graphql/queries/get-authenticated-user'
import { storeToRefs } from 'pinia'

const router = useRouter()
const userStore = useUserStore()
const message = useMessage()
const { createUserApiDataGetters } = storeToRefs(userStore)

const loading = ref(true)
const error = ref<string | null>(null)
const user = ref<User | null>(null)
const needsActivation = ref(false)
const showRegistration = ref(false)
const telegramId = ref<string | null>(null)

const registrationForm = ref({
  firstName: '',
  lastName: ''
})

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
    const telegramUserId = WebApp.initDataUnsafe?.user?.id?.toString()
    
    if (!telegramUserId) {
      error.value = 'Не удалось получить Telegram ID'
      loading.value = false
      return
    }

    telegramId.value = telegramUserId

    // Ищем пользователя по telegramId
    const foundUser = await userStore.getUserByTelegramIdAction(telegramUserId)
    
    if (!foundUser) {
      // Если пользователь не найден, показываем форму регистрации
      showRegistration.value = true
      // Предзаполняем имя из Telegram, если доступно
      const telegramUser = WebApp.initDataUnsafe?.user
      if (telegramUser?.first_name) {
        registrationForm.value.firstName = telegramUser.first_name
      }
      if (telegramUser?.last_name) {
        registrationForm.value.lastName = telegramUser.last_name
      }
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
  if (!telegramId.value) {
    message.error('Не удалось получить Telegram ID')
    return
  }

  try {
    loading.value = true
    await userStore.activateUserAction(telegramId.value)
    
    if (userStore.activateUserApiDataGetters.success && userStore.activateUserApiDataGetters.data) {
      message.success('Пользователь успешно активирован')
      const activatedUser = userStore.activateUserApiDataGetters.data
      // Обновляем пользователя данными из ответа
      if (user.value) {
        user.value.activated = true
        user.value.name = activatedUser.name
        userStore.setUser(user.value)
      }
      needsActivation.value = false
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

const handleRegister = async () => {
  if (!telegramId.value) {
    message.error('Не удалось получить Telegram ID')
    return
  }

  try {
    loading.value = true
    const createdUser = await userStore.createUserAction({
      telegramId: telegramId.value,
      firstName: registrationForm.value.firstName || undefined,
      lastName: registrationForm.value.lastName || undefined
    })
    
    if (createdUser) {
      message.success('Пользователь успешно зарегистрирован')
      user.value = createdUser
      
      // Проверяем, требуется ли активация
      if (!createdUser.activated) {
        needsActivation.value = true
        showRegistration.value = false
      } else {
        userStore.setUser(createdUser)
        router.push('/dashboard')
      }
    } else {
      message.error(userStore.createUserApiDataGetters.message || 'Ошибка регистрации')
    }
  } catch (err: any) {
    message.error(err?.message || 'Ошибка регистрации пользователя')
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
      
      <div v-else-if="showRegistration" class="max-w-md w-full">
        <n-card title="Регистрация">
          <div class="flex flex-col gap-4">
            <p>Добро пожаловать! Вы еще не зарегистрированы в системе.</p>
            <n-form :model="registrationForm">
              <n-form-item label="Имя" path="firstName">
                <n-input
                  v-model:value="registrationForm.firstName"
                  placeholder="Введите ваше имя"
                  :disabled="createUserApiDataGetters.loading"
                />
              </n-form-item>
              <n-form-item label="Фамилия" path="lastName">
                <n-input
                  v-model:value="registrationForm.lastName"
                  placeholder="Введите вашу фамилию"
                  :disabled="createUserApiDataGetters.loading"
                />
              </n-form-item>
            </n-form>
            <n-button
              type="primary"
              :loading="createUserApiDataGetters.loading"
              :disabled="createUserApiDataGetters.loading"
              @click="handleRegister"
              block
            >
              Зарегистрироваться
            </n-button>
          </div>
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

