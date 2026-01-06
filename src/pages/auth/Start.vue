<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import WebApp from '@twa-dev/sdk'
import { useUserStore } from '@/stores/user'
import { NSpin, NCard, NButton, useMessage, NForm, NFormItem, NInput } from 'naive-ui'
import type { User } from '@/graphql/queries/get-authenticated-user'
import { storeToRefs } from 'pinia'
import { Config } from '@/config'

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

const hasTestTelegramId = computed(() => !!Config.MY_TELEGRAM_ID)

const checkUser = async () => {
  try {
    loading.value = true
    error.value = null

    // Очищаем токены, так как для Telegram Mini App авторизация происходит через telegramId
    userStore.clearTokens()

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

    // Проверяем блокировку пользователя
    if (foundUser.blockReasons && foundUser.blockReasons.length > 0) {
      // Пользователь заблокирован, показываем сообщение
      const reasonsText = foundUser.blockReasons
        .map(reason => reason.description || reason.name)
        .join('\n')
      error.value = `Ваш аккаунт заблокирован.\n\nПричины блокировки:\n${reasonsText}`
      loading.value = false
      return
    }

    // Проверяем поле activated
    if (!foundUser.activated) {
      needsActivation.value = true
      loading.value = false
      return
    }

    // Если пользователь активирован, сохраняем его и переходим на главную
    userStore.setUser(foundUser)
    userStore.setTelegramId(telegramUserId)
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
      if (telegramId.value) {
        userStore.setTelegramId(telegramId.value)
      }
      
      // После активации проверяем блокировку
      // Перезагружаем пользователя, чтобы получить актуальные данные о блокировке
      const updatedUser = await userStore.getUserByTelegramIdAction(telegramId.value)
      if (updatedUser) {
        if (updatedUser.blockReasons && updatedUser.blockReasons.length > 0) {
          const reasonsText = updatedUser.blockReasons
            .map(reason => reason.description || reason.name)
            .join('\n')
          error.value = `Ваш аккаунт заблокирован.\n\nПричины блокировки:\n${reasonsText}`
          loading.value = false
          return
        }
        userStore.setUser(updatedUser)
      }
      
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
      
      // Проверяем блокировку пользователя
      if (createdUser.blockReasons && createdUser.blockReasons.length > 0) {
        const reasonsText = createdUser.blockReasons
          .map(reason => reason.description || reason.name)
          .join('\n')
        error.value = `Ваш аккаунт заблокирован.\n\nПричины блокировки:\n${reasonsText}`
        showRegistration.value = false
        loading.value = false
        return
      }
      
      // Проверяем, требуется ли активация
      if (!createdUser.activated) {
        needsActivation.value = true
        showRegistration.value = false
      } else {
        userStore.setUser(createdUser)
        if (telegramId.value) {
          userStore.setTelegramId(telegramId.value)
        }
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

const handleTestLogin = async () => {
  if (!Config.MY_TELEGRAM_ID) {
    message.error('MY_TELEGRAM_ID не задан в конфигурации')
    return
  }

  try {
    loading.value = true
    error.value = null
    showRegistration.value = false
    needsActivation.value = false

    // Очищаем токены, так как для Telegram Mini App авторизация происходит через telegramId
    userStore.clearTokens()

    telegramId.value = Config.MY_TELEGRAM_ID

    // Ищем пользователя по telegramId
    const foundUser = await userStore.getUserByTelegramIdAction(Config.MY_TELEGRAM_ID)
    
    if (!foundUser) {
      // Если пользователь не найден, показываем форму регистрации
      showRegistration.value = true
      loading.value = false
      return
    }

    user.value = foundUser

    // Проверяем блокировку пользователя
    if (foundUser.blockReasons && foundUser.blockReasons.length > 0) {
      // Пользователь заблокирован, показываем сообщение
      const reasonsText = foundUser.blockReasons
        .map(reason => reason.description || reason.name)
        .join('\n')
      error.value = `Ваш аккаунт заблокирован.\n\nПричины блокировки:\n${reasonsText}`
      loading.value = false
      return
    }

    // Проверяем поле activated
    if (!foundUser.activated) {
      needsActivation.value = true
      loading.value = false
      return
    }

    // Если пользователь активирован, сохраняем его и переходим на главную
    userStore.setUser(foundUser)
    userStore.setTelegramId(Config.MY_TELEGRAM_ID)
    router.push('/dashboard')
  } catch (err: any) {
    error.value = err?.message || 'Произошла ошибка при проверке пользователя'
    loading.value = false
  }
}

onMounted(() => {
  checkUser()
})
</script>

<template>
  <div class="flex flex-col items-center justify-center h-full p-4">
    <!-- Временная кнопка для тестирования -->
    <div v-if="hasTestTelegramId" class="mb-4 max-w-md w-full">
      <n-button
        type="warning"
        :disabled="loading"
        @click="handleTestLogin"
        block
      >
        Тестовый вход (ID: {{ Config.MY_TELEGRAM_ID }})
      </n-button>
    </div>
    
    <n-spin :show="loading">
      <div v-if="error" class="max-w-md w-full">
        <n-card title="Ошибка">
          <pre class="whitespace-pre-wrap text-red-500">{{ error }}</pre>
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

