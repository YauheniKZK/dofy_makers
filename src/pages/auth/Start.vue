<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'
import WebApp from '@twa-dev/sdk'
import { useUserStore } from '@/stores/user'
import { NSpin, NCard, NButton, useMessage, NForm, NFormItem, NInput, NIcon } from 'naive-ui'
import type { User } from '@/graphql/queries/get-authenticated-user'
import { storeToRefs } from 'pinia'
import { Config } from '@/config'
import { loginByTelegramId } from '@/graphql/services/user'
import { ChevronCircleRight48Regular } from '@vicons/fluent'
import { useI18n } from 'vue-i18n'
import Drawer from '@/components/ui/Drawer.vue'
import Button from '@/components/ui/Button.vue'
const { t } = useI18n()

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
const showLoginModal = ref(false)

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
      router.push('/feeds')
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

    // Получаем photo_url из Telegram WebApp для синхронизации аватара
    const photoUrl = WebApp.initDataUnsafe?.user?.photo_url || undefined

    // Используем loginByTelegramId напрямую для авторизации
    console.log('Вызываем loginByTelegramId для авторизации:', telegramUserId)
    try {
      const loginResult = await loginByTelegramId(telegramUserId, photoUrl)
      
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
          router.push('/feeds')
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
      
      // Получаем photo_url из Telegram WebApp для синхронизации аватара
      const photoUrl = WebApp.initDataUnsafe?.user?.photo_url || undefined

      // После активации получаем токены через loginByTelegramId
      try {
        const loginResult = await loginByTelegramId(telegramId.value, photoUrl)
        
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
            avatarUrl: userData.avatarUrl ?? null,
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
          router.push('/feeds')
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
    // Получаем photo_url из Telegram WebApp
    const photoUrl = WebApp.initDataUnsafe?.user?.photo_url || null
    
    const createdUser = await userStore.createUserAction({
      telegramId: telegramId.value,
      firstName: registrationForm.value.firstName || undefined,
      lastName: registrationForm.value.lastName || undefined,
      photoUrl: photoUrl || undefined
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
        // Получаем photo_url из Telegram WebApp для синхронизации аватара
        const photoUrl = WebApp.initDataUnsafe?.user?.photo_url || undefined

        // Если пользователь уже активирован, получаем токены
        try {
          const loginResult = await loginByTelegramId(telegramId.value, photoUrl)
          
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
              avatarUrl: userData.avatarUrl ?? null,
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
            router.push('/feeds')
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

    // Получаем photo_url из Telegram WebApp для синхронизации аватара (если доступен)
    const photoUrl = WebApp?.initDataUnsafe?.user?.photo_url || undefined

    // Используем loginByTelegramId для авторизации (как в checkUser)
    console.log('Тестовый вход: вызываем loginByTelegramId для авторизации:', Config.MY_TELEGRAM_ID)
    try {
      const loginResult = await loginByTelegramId(Config.MY_TELEGRAM_ID, photoUrl)
      
      if (loginResult.data?.loginByTelegramId?.successfully && loginResult.data.loginByTelegramId.data) {
        // Авторизация успешна - получили токены
        const authData = loginResult.data.loginByTelegramId.data
        
        // Сохраняем токены
        userStore.setTokens({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken
        })
        userStore.setTelegramId(Config.MY_TELEGRAM_ID)
        
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
          router.push('/feeds')
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

onMounted(() => {
  checkUser()
})
</script>

<template>
  <div class="flex flex-col grow">
    <div class="flex flex-col grow p-4 h-2/3 bg-[#36656B]">
    </div>
    <div class="flex flex-col justify-between grow p-4 h-1/3">
      <div class="flex flex-col grow">
        <h1 class="text-2xl font-bold">{{ t('welcome_text_title') }}</h1>
        <p class="text-lg">{{ t('welcome_text_description') }}</p>
      </div>
      <div class="flex justify-end">
        <n-button text @click="showLoginModal = true">
          <div class="flex items-center gap-2">
            {{ t('welcome_text_button') }}
            <n-icon :size="32">
              <ChevronCircleRight48Regular />
            </n-icon>
          </div>
        </n-button>
      </div>
    </div>
    <Drawer :showModal="showLoginModal" @close="showLoginModal = false">
      <template #content>
        <div class="flex flex-col grow">
          <h2 class="text-2xl font-bold">{{ t('login_title') }}</h2>
          <div class="flex flex-col justify-end grow">
            <Button title="Login" :color="'#000000'" :textColor="'white'" @click="handleTestLogin" />
          </div>
        </div>
      </template>
    </Drawer>
  </div>

</template>

<style scoped>
</style>

