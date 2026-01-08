<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import WebApp from '@twa-dev/sdk'
import { useUserStore } from '@/stores/user'
import { NSpin, NCard, NButton, useMessage, NForm, NFormItem, NInput } from 'naive-ui'
import type { User } from '@/graphql/queries/get-authenticated-user'
import { storeToRefs } from 'pinia'
import { Config } from '@/config'
import { loginByTelegramId } from '@/graphql/services/user'

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

    // Проверяем, не загружен ли уже пользователь из init()
    if (userStore.currentUserGetters && userStore.isAuthenticated) {
      // Пользователь уже загружен, переходим на dashboard
      router.push('/dashboard')
      loading.value = false
      return
    }

    // Проверяем наличие Telegram WebApp
    if (!WebApp) {
      error.value = 'Приложение должно быть запущено через Telegram'
      loading.value = false
      return
    }

    // Инициализируем WebApp и ждем готовности
    WebApp.ready()
    WebApp.expand()

    // Небольшая задержка для мобильных устройств, чтобы WebApp успел инициализироваться
    await new Promise(resolve => setTimeout(resolve, 100))

    // Пробуем получить telegramId разными способами
    let telegramUserId: string | null = null

    // Способ 1: из initDataUnsafe.user.id (основной способ)
    if (WebApp.initDataUnsafe?.user?.id) {
      telegramUserId = WebApp.initDataUnsafe.user.id.toString()
    }

    // Способ 2: из initData (если initDataUnsafe недоступен)
    if (!telegramUserId && WebApp.initData) {
      try {
        const initData = new URLSearchParams(WebApp.initData)
        const userData = initData.get('user')
        if (userData) {
          const userObj = JSON.parse(decodeURIComponent(userData))
          if (userObj?.id) {
            telegramUserId = userObj.id.toString()
          }
        }
      } catch (e) {
        console.warn('Не удалось распарсить initData:', e)
      }
    }

    // Способ 3: из window.Telegram.WebApp (для мобильных)
    if (!telegramUserId && (window as any).Telegram?.WebApp?.initDataUnsafe?.user?.id) {
      telegramUserId = (window as any).Telegram.WebApp.initDataUnsafe.user.id.toString()
    }

    // Логируем для отладки
    console.log('WebApp:', {
      initDataUnsafe: WebApp.initDataUnsafe,
      initData: WebApp.initData ? 'present' : 'missing',
      platform: WebApp.platform,
      version: WebApp.version,
      telegramUserId
    })
    
    if (!telegramUserId) {
      const platform = WebApp.platform || 'unknown'
      const version = WebApp.version || 'unknown'
      error.value = `Не удалось получить Telegram ID.\n\nПлатформа: ${platform}\nВерсия: ${version}\n\nУбедитесь, что приложение запущено через Telegram.`
      console.error('Не удалось получить Telegram ID:', {
        platform,
        version,
        initDataUnsafe: WebApp.initDataUnsafe,
        initData: WebApp.initData ? 'present' : 'missing',
        WebApp: WebApp
      })
      loading.value = false
      return
    }

    telegramId.value = telegramUserId

    // Используем loginByTelegramId напрямую для авторизации
    console.log('Вызываем loginByTelegramId для авторизации:', telegramUserId)
    try {
      const loginResult = await loginByTelegramId(telegramUserId)
      
      if (loginResult.data?.loginByTelegramId?.successfully && loginResult.data.loginByTelegramId.data) {
        // Авторизация успешна - получили токены
        const authData = loginResult.data.loginByTelegramId.data
        
        // Сохраняем токены
        userStore.setTokens({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken
        })
        userStore.setTelegramId(telegramUserId)
        
        // После получения токенов загружаем пользователя через getCurrentUser
        console.log('Токены получены, загружаем пользователя через fetchCurrentUser')
        try {
          await userStore.fetchCurrentUser()
          
          const foundUser = userStore.currentUserGetters
          if (!foundUser) {
            error.value = 'Не удалось загрузить данные пользователя'
            loading.value = false
            return
          }
          
          user.value = foundUser
          
          // Проверяем блокировку пользователя
          if (foundUser.blockReasons && foundUser.blockReasons.length > 0) {
            const reasonsText = foundUser.blockReasons
              .map((reason: any) => reason.description || reason.name)
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
          
          // Пользователь активирован, переходим на dashboard
          router.push('/dashboard')
        } catch (fetchError: any) {
          const errorMessage = fetchError?.message || 'Ошибка загрузки данных пользователя'
          error.value = errorMessage
          loading.value = false
          console.error('Ошибка загрузки пользователя после авторизации:', fetchError)
        }
      } else {
        // Пользователь не найден или ошибка авторизации
        const errorMsg = loginResult.data?.loginByTelegramId?.error || loginResult.data?.loginByTelegramId?.message || 'Пользователь не найден'
        
        // Если пользователь не найден, показываем форму регистрации
        if (errorMsg.toLowerCase().includes('не найден') || errorMsg.toLowerCase().includes('not found')) {
          showRegistration.value = true
          // Предзаполняем имя из Telegram, если доступно
          const telegramUser = WebApp.initDataUnsafe?.user
          if (telegramUser?.first_name) {
            registrationForm.value.firstName = telegramUser.first_name
          }
          if (telegramUser?.last_name) {
            registrationForm.value.lastName = telegramUser.last_name
          }
        } else {
          error.value = `Ошибка авторизации: ${errorMsg}`
        }
        loading.value = false
      }
    } catch (loginError: any) {
      const errorMessage = loginError?.message || 'Ошибка авторизации'
      
      // Если пользователь не найден, показываем форму регистрации
      if (errorMessage.toLowerCase().includes('не найден') || errorMessage.toLowerCase().includes('not found')) {
        showRegistration.value = true
        // Предзаполняем имя из Telegram, если доступно
        const telegramUser = WebApp.initDataUnsafe?.user
        if (telegramUser?.first_name) {
          registrationForm.value.firstName = telegramUser.first_name
        }
        if (telegramUser?.last_name) {
          registrationForm.value.lastName = telegramUser.last_name
        }
      } else {
        error.value = errorMessage
      }
      loading.value = false
      console.error('Ошибка авторизации через loginByTelegramId:', loginError)
    }
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
      
      // После активации получаем токены через loginByTelegramId
      try {
        const loginResult = await loginByTelegramId(telegramId.value)
        
        if (loginResult.data?.loginByTelegramId?.successfully && loginResult.data.loginByTelegramId.data) {
          const authData = loginResult.data.loginByTelegramId.data
          // Сохраняем токены
          userStore.setTokens({
            accessToken: authData.accessToken,
            refreshToken: authData.refreshToken
          })
          // Сохраняем пользователя
          const userData = authData.user as any
          userStore.setUser({
            id: userData.id,
            name: userData.name,
            email: userData.email,
            telegramId: userData.telegramId,
            activated: true,
            description: userData.description ?? null,
            shortDescription: userData.shortDescription ?? null,
            country: userData.country ?? null,
            city: userData.city ?? null,
            phone: userData.phone ?? null,
            role: userData.role,
            blockReasons: [],
            createdAt: userData.createdAt || new Date().toISOString(),
            updatedAt: userData.updatedAt || new Date().toISOString()
          })
          userStore.setTelegramId(telegramId.value)
          router.push('/dashboard')
        } else {
          const errorMsg = loginResult.data?.loginByTelegramId?.error || loginResult.data?.loginByTelegramId?.message || 'Ошибка получения токенов'
          message.error(`Не удалось получить токены: ${errorMsg}`)
        }
      } catch (loginError: any) {
        const errorMessage = loginError?.message || 'Ошибка получения токенов авторизации'
        message.error(errorMessage)
        console.error('Ошибка получения токенов после активации:', loginError)
      }
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
        // Если пользователь уже активирован, получаем токены
        try {
          const loginResult = await loginByTelegramId(telegramId.value)
          
          if (loginResult.data?.loginByTelegramId?.successfully && loginResult.data.loginByTelegramId.data) {
            const authData = loginResult.data.loginByTelegramId.data
            // Сохраняем токены
            userStore.setTokens({
              accessToken: authData.accessToken,
              refreshToken: authData.refreshToken
            })
            // Сохраняем пользователя
            const userData = authData.user as any
            userStore.setUser({
              id: userData.id,
              name: userData.name,
              email: userData.email,
              telegramId: userData.telegramId,
              activated: true,
              description: userData.description ?? null,
              shortDescription: userData.shortDescription ?? null,
              country: userData.country ?? null,
              city: userData.city ?? null,
              phone: userData.phone ?? null,
              role: userData.role,
              blockReasons: [],
              createdAt: userData.createdAt || new Date().toISOString(),
              updatedAt: userData.updatedAt || new Date().toISOString()
            })
            userStore.setTelegramId(telegramId.value)
            router.push('/dashboard')
          } else {
            const errorMsg = loginResult.data?.loginByTelegramId?.error || loginResult.data?.loginByTelegramId?.message || 'Ошибка получения токенов'
            message.error(`Не удалось получить токены: ${errorMsg}`)
          }
        } catch (loginError: any) {
          const errorMessage = loginError?.message || 'Ошибка получения токенов авторизации'
          message.error(errorMessage)
          console.error('Ошибка получения токенов после регистрации:', loginError)
        }
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
  <div class="start-page">
    <!-- Временная кнопка для тестирования -->
    <div v-if="hasTestTelegramId" class="test-button-wrapper">
      <n-button
        type="warning"
        :disabled="loading"
        @click="handleTestLogin"
        block
        size="large"
        class="test-button"
      >
        Тестовый вход (ID: {{ Config.MY_TELEGRAM_ID }})
      </n-button>
    </div>
    
    <n-spin :show="loading">
      <div class="auth-container">
        <!-- Ошибка -->
        <div v-if="error" class="auth-card error-card">
          <div class="error-icon">⚠️</div>
          <h2 class="auth-title">Ошибка</h2>
          <pre class="error-message">{{ error }}</pre>
        </div>
        
        <!-- Регистрация -->
        <div v-else-if="showRegistration" class="auth-card">
          <div class="auth-header">
            <div class="auth-icon">👋</div>
            <h2 class="auth-title">Добро пожаловать!</h2>
            <p class="auth-subtitle">Заполните форму для регистрации</p>
          </div>
          <n-form :model="registrationForm" class="auth-form">
            <n-form-item label="Имя" path="firstName">
              <n-input
                v-model:value="registrationForm.firstName"
                placeholder="Введите ваше имя"
                :disabled="createUserApiDataGetters.loading"
                size="large"
                round
              />
            </n-form-item>
            <n-form-item label="Фамилия" path="lastName">
              <n-input
                v-model:value="registrationForm.lastName"
                placeholder="Введите вашу фамилию"
                :disabled="createUserApiDataGetters.loading"
                size="large"
                round
              />
            </n-form-item>
            <n-button
              type="primary"
              :loading="createUserApiDataGetters.loading"
              :disabled="createUserApiDataGetters.loading"
              @click="handleRegister"
              block
              size="large"
              round
              class="auth-submit-button"
            >
              Зарегистрироваться
            </n-button>
          </n-form>
        </div>
        
        <!-- Активация -->
        <div v-else-if="needsActivation && user" class="auth-card">
          <div class="auth-header">
            <div class="auth-icon">✨</div>
            <h2 class="auth-title">Добро пожаловать, {{ user.name }}!</h2>
            <p class="auth-subtitle">Для продолжения необходимо активировать ваш аккаунт</p>
          </div>
          <n-button
            type="primary"
            :loading="loading"
            @click="handleActivate"
            block
            size="large"
            round
            class="auth-submit-button"
          >
            Активировать аккаунт
          </n-button>
        </div>
        
        <!-- Загрузка -->
        <div v-else class="auth-card">
          <div class="loading-content">
            <div class="loading-spinner"></div>
            <p class="loading-text">Загрузка...</p>
          </div>
        </div>
      </div>
    </n-spin>
  </div>
</template>

<style scoped>
.start-page {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem 1rem;
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
}

.test-button-wrapper {
  max-width: 420px;
  width: 100%;
  margin-bottom: 1.5rem;
}

.test-button {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.auth-container {
  max-width: 420px;
  width: 100%;
}

.auth-card {
  background: white;
  border-radius: 20px;
  padding: 2.5rem 2rem;
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1), 0 4px 6px -2px rgb(0 0 0 / 0.05);
  border: 1px solid #e2e8f0;
  animation: fadeIn 0.4s ease-out;
}

.error-card {
  text-align: center;
}

.error-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.auth-icon {
  font-size: 3.5rem;
  margin-bottom: 1rem;
  animation: fadeIn 0.5s ease-out;
}

.auth-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.auth-subtitle {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}

.auth-form {
  margin-top: 1.5rem;
}

.auth-submit-button {
  margin-top: 1.5rem;
  height: 48px;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 4px 6px -1px rgb(59 130 246 / 0.3);
}

.auth-submit-button:hover {
  box-shadow: 0 6px 12px -2px rgb(59 130 246 / 0.4);
  transform: translateY(-1px);
}

.error-message {
  white-space: pre-wrap;
  color: #ef4444;
  text-align: left;
  background: #fef2f2;
  padding: 1rem;
  border-radius: 8px;
  font-size: 0.9rem;
  line-height: 1.6;
  margin-top: 1rem;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}

.loading-spinner {
  width: 48px;
  height: 48px;
  border: 4px solid #e2e8f0;
  border-top-color: #3b82f6;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
  margin-bottom: 1rem;
}

.loading-text {
  color: #64748b;
  font-size: 0.95rem;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

:deep(.n-form-item-label) {
  font-weight: 500;
  color: #475569;
  font-size: 0.9rem;
}

:deep(.n-input) {
  border-radius: 10px;
}

:deep(.n-card) {
  border-radius: 20px;
  box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1);
}
</style>

