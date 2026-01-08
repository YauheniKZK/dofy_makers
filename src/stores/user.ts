import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import Cookies from 'js-cookie'
import router from '@/router'
import { login as loginApi, refreshToken as refreshTokenApi, getCurrentUser as getCurrentUserApi, getUserByTelegramId as getUserByTelegramIdApi, activateUser as activateUserApi, registerUserByTelegram as registerUserByTelegramApi } from '@/graphql/services/user'
import type { LoginInput, AuthPayload } from '@/graphql/mutations/create-tokens-user'
import type { User, BlockReason } from '@/graphql/queries/get-authenticated-user'
import type { ActivatedUser } from '@/graphql/mutations/activate-user'
import type { RegisterUserByTelegramInput } from '@/graphql/mutations/create-user'

const ACCESS_TOKEN_KEY = 'access_token'
const REFRESH_TOKEN_KEY = 'refresh_token'
const TELEGRAM_ID_KEY = 'telegram_id'
const TOKEN_EXPIRY_DAYS = 7

// Универсальный интерфейс для состояния запроса
interface ApiState<T = any> {
  data: T | null
  loading: boolean
  success: boolean
  error: boolean
  message: string
}

// Универсальная функция для создания дефолтного состояния
const createDefaultApiState = <T = any>(): ApiState<T> => ({
  data: null,
  loading: false,
  success: false,
  error: false,
  message: ''
})

// Универсальная функция для сброса состояния
const resetApiState = <T = any>(state: ApiState<T>): void => {
  state.data = null
  state.loading = false
  state.success = false
  state.error = false
  state.message = ''
}

export const useUserStore = defineStore('user', () => {
  // -----------------STATE---------------------
  const accessToken = ref<string | null>(Cookies.get(ACCESS_TOKEN_KEY) || null)
  const refreshToken = ref<string | null>(Cookies.get(REFRESH_TOKEN_KEY) || null)
  const currentUser = ref<User | null>(null)
  
  // Состояния для каждого API запроса
  const getUserByTelegramIdApiData = ref<ApiState<User>>(createDefaultApiState<User>())
  const getCurrentUserApiData = ref<ApiState<User>>(createDefaultApiState<User>())
  const loginApiData = ref<ApiState<AuthPayload>>(createDefaultApiState<AuthPayload>())
  const refreshTokenApiData = ref<ApiState<AuthPayload>>(createDefaultApiState<AuthPayload>())
  const activateUserApiData = ref<ApiState<ActivatedUser>>(createDefaultApiState<ActivatedUser>())
  const createUserApiData = ref<ApiState<User>>(createDefaultApiState<User>())

  // -----------------GETTERS---------------------
  const currentUserGetters = computed(() => currentUser.value)
  const accessTokenGetters = computed(() => accessToken.value)
  const refreshTokenGetters = computed(() => refreshToken.value)
  const isAuthenticated = computed(() => !!accessToken.value)
  const isBlocked = computed(() => {
    if (!currentUser.value) return false
    return currentUser.value.blockReasons && currentUser.value.blockReasons.length > 0
  })
  const blockReasons = computed(() => {
    if (!currentUser.value) return []
    return currentUser.value.blockReasons || []
  })
  
  // Геттеры для API состояний
  const getUserByTelegramIdApiDataGetters = computed(() => getUserByTelegramIdApiData.value)
  const getCurrentUserApiDataGetters = computed(() => getCurrentUserApiData.value)
  const loginApiDataGetters = computed(() => loginApiData.value)
  const refreshTokenApiDataGetters = computed(() => refreshTokenApiData.value)
  const activateUserApiDataGetters = computed(() => activateUserApiData.value)
  const createUserApiDataGetters = computed(() => createUserApiData.value)

  // -----------------ACTIONS---------------------

  const setTokens = (tokens: { accessToken: string; refreshToken: string }) => {
    accessToken.value = tokens.accessToken
    refreshToken.value = tokens.refreshToken
    
    // Сохраняем токены в cookies с правильными настройками
    Cookies.set(ACCESS_TOKEN_KEY, tokens.accessToken, { 
      expires: 1, // Access token на 1 день
      path: '/',
      sameSite: 'strict'
    })
    Cookies.set(REFRESH_TOKEN_KEY, tokens.refreshToken, { 
      expires: TOKEN_EXPIRY_DAYS, // Refresh token на 7 дней
      path: '/',
      sameSite: 'strict'
    })
  }

  const clearTokens = () => {
    accessToken.value = null
    refreshToken.value = null
    currentUser.value = null
    
    Cookies.remove(ACCESS_TOKEN_KEY)
    Cookies.remove(REFRESH_TOKEN_KEY)
    sessionStorage.removeItem(TELEGRAM_ID_KEY)
  }

  const setTelegramId = (telegramId: string) => {
    sessionStorage.setItem(TELEGRAM_ID_KEY, telegramId)
  }

  const getTelegramId = (): string | null => {
    return sessionStorage.getItem(TELEGRAM_ID_KEY)
  }

  const setUser = (user: User) => {
    currentUser.value = user
  }

  const loginAction = async (input: LoginInput): Promise<void> => {
    resetApiState(loginApiData.value)
    loginApiData.value.loading = true
    
    try {
      const response = await loginApi(input)
      
      if (response.data?.login?.successfully && response.data.login.data) {
        const authData = response.data.login.data as AuthPayload
        loginApiData.value.data = authData
        loginApiData.value.success = true
        loginApiData.value.message = response.data.login.message || 'Успешный вход'
        
        setTokens({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken
        })
        // Преобразуем данные пользователя в формат User
        const userData = authData.user as any
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          telegramId: userData.telegramId,
          activated: userData.activated ?? false,
          description: userData.description ?? null,
          shortDescription: userData.shortDescription ?? null,
          country: userData.country ?? null,
          city: userData.city ?? null,
          phone: userData.phone ?? null,
          role: userData.role,
          blockReasons: userData.blockReasons || [],
          specializations: userData.specializations || [],
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString()
        })
        router.push('/dashboard')
      } else {
        const errorMsg = response.data?.login?.error || response.data?.login?.message || 'Ошибка авторизации'
        loginApiData.value.error = true
        loginApiData.value.message = errorMsg
        clearTokens()
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.graphQLErrors?.[0]?.message || 'Ошибка авторизации'
      loginApiData.value.error = true
      loginApiData.value.message = errorMessage
      clearTokens()
    } finally {
      loginApiData.value.loading = false
    }
  }

  const refreshTokenAction = async (): Promise<void> => {
    if (!refreshToken.value) {
      return
    }

    resetApiState(refreshTokenApiData.value)
    refreshTokenApiData.value.loading = true
    
    try {
      const response = await refreshTokenApi(refreshToken.value)
      
      if (response.data?.refreshToken?.successfully && response.data.refreshToken.data) {
        const authData = response.data.refreshToken.data as AuthPayload
        refreshTokenApiData.value.data = authData
        refreshTokenApiData.value.success = true
        refreshTokenApiData.value.message = response.data.refreshToken.message || 'Токен обновлен'
        
        setTokens({
          accessToken: authData.accessToken,
          refreshToken: authData.refreshToken
        })
        // Преобразуем данные пользователя в формат User
        const userData = authData.user as any
        setUser({
          id: userData.id,
          name: userData.name,
          email: userData.email,
          telegramId: userData.telegramId,
          activated: userData.activated ?? false,
          description: userData.description ?? null,
          shortDescription: userData.shortDescription ?? null,
          country: userData.country ?? null,
          city: userData.city ?? null,
          phone: userData.phone ?? null,
          role: userData.role,
          blockReasons: userData.blockReasons || [],
          specializations: userData.specializations || [],
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString()
        })
      } else {
        const errorMsg = response.data?.refreshToken?.error || response.data?.refreshToken?.message || 'Ошибка обновления токена'
        refreshTokenApiData.value.error = true
        refreshTokenApiData.value.message = errorMsg
        clearTokens()
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка обновления токена'
      refreshTokenApiData.value.error = true
      refreshTokenApiData.value.message = errorMessage
      clearTokens()
    } finally {
      refreshTokenApiData.value.loading = false
    }
  }

  const fetchCurrentUser = async (): Promise<void> => {
    // Если пользователь уже загружен, не делаем повторный запрос
    if (currentUser.value) {
      return
    }
    
    // Если запрос уже выполняется, ждем его завершения
    if (getCurrentUserApiData.value.loading) {
      return
    }
    
    resetApiState(getCurrentUserApiData.value)
    getCurrentUserApiData.value.loading = true
    
    try {
      const response = await getCurrentUserApi()
      
      if (response.data?.me?.successfully && response.data.me.data) {
        const userData = response.data.me.data as any
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          telegramId: userData.telegramId,
          activated: userData.activated ?? false,
          description: userData.description ?? null,
          shortDescription: userData.shortDescription ?? null,
          country: userData.country ?? null,
          city: userData.city ?? null,
          phone: userData.phone ?? null,
          role: userData.role,
          blockReasons: userData.blockReasons || [],
          specializations: userData.specializations || [],
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString()
        }
        getCurrentUserApiData.value.data = user
        getCurrentUserApiData.value.success = true
        getCurrentUserApiData.value.message = response.data.me.message || 'Пользователь загружен'
        setUser(user)
      } else {
        // Если не удалось получить пользователя, возможно токен истек
        const errorMsg = response.data?.me?.error || response.data?.me?.message || 'Не удалось получить пользователя'
        getCurrentUserApiData.value.error = true
        getCurrentUserApiData.value.message = errorMsg
        
        if (refreshToken.value) {
          await refreshTokenAction()
          // Проверяем результат через состояние refreshTokenApiData
          if (refreshTokenApiData.value.error) {
            throw new Error('Сессия истекла')
          }
        } else {
          throw new Error('Не авторизован')
        }
      }
    } catch (error: any) {
      const errorMessage = error?.message || 'Ошибка получения пользователя'
      getCurrentUserApiData.value.error = true
      getCurrentUserApiData.value.message = errorMessage
      clearTokens()
      throw error
    } finally {
      getCurrentUserApiData.value.loading = false
    }
  }

  const logoutAction = async (): Promise<void> => {
    clearTokens()
    router.push('/login')
  }

  const getUserByTelegramIdAction = async (telegramId: string): Promise<User | null> => {
    resetApiState(getUserByTelegramIdApiData.value)
    getUserByTelegramIdApiData.value.loading = true
    
    try {
      const response = await getUserByTelegramIdApi(telegramId)
      
      if (response.data?.userByTelegramId?.successfully && response.data.userByTelegramId.data) {
        const userData = response.data.userByTelegramId.data as any
        const user: User = {
          id: userData.id,
          name: userData.name,
          email: userData.email,
          telegramId: userData.telegramId,
          activated: userData.activated ?? false,
          description: userData.description ?? null,
          shortDescription: userData.shortDescription ?? null,
          country: userData.country ?? null,
          city: userData.city ?? null,
          phone: userData.phone ?? null,
          role: userData.role,
          blockReasons: userData.blockReasons || [],
          specializations: userData.specializations || [],
          createdAt: userData.createdAt || new Date().toISOString(),
          updatedAt: userData.updatedAt || new Date().toISOString()
        }
        getUserByTelegramIdApiData.value.data = user
        getUserByTelegramIdApiData.value.success = true
        getUserByTelegramIdApiData.value.message = response.data.userByTelegramId.message || 'Пользователь получен'
        return user
      } else {
        const errorMsg = response.data?.userByTelegramId?.error || response.data?.userByTelegramId?.message || 'Пользователь не найден'
        getUserByTelegramIdApiData.value.error = true
        getUserByTelegramIdApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.graphQLErrors?.[0]?.message || 'Ошибка получения пользователя'
      getUserByTelegramIdApiData.value.error = true
      getUserByTelegramIdApiData.value.message = errorMessage
      return null
    } finally {
      getUserByTelegramIdApiData.value.loading = false
    }
  }

  const activateUserAction = async (telegramId: string): Promise<void> => {
    resetApiState(activateUserApiData.value)
    activateUserApiData.value.loading = true
    
    try {
      const response = await activateUserApi(telegramId)
      
      if (response.data?.activateUser?.successfully && response.data.activateUser.data) {
        const activatedUser = response.data.activateUser.data
        activateUserApiData.value.data = activatedUser
        activateUserApiData.value.success = true
        activateUserApiData.value.message = response.data.activateUser.message || 'Пользователь активирован'
      } else {
        const errorMsg = response.data?.activateUser?.error || response.data?.activateUser?.message || 'Не удалось активировать пользователя'
        activateUserApiData.value.error = true
        activateUserApiData.value.message = errorMsg
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.graphQLErrors?.[0]?.message || 'Ошибка активации пользователя'
      activateUserApiData.value.error = true
      activateUserApiData.value.message = errorMessage
    } finally {
      activateUserApiData.value.loading = false
    }
  }

  const createUserAction = async (input: RegisterUserByTelegramInput): Promise<User | null> => {
    resetApiState(createUserApiData.value)
    createUserApiData.value.loading = true
    
    try {
      const response = await registerUserByTelegramApi(input)
      
      if (response.data?.registerUserByTelegram?.successfully && response.data.registerUserByTelegram.data) {
        const registeredUser = response.data.registerUserByTelegram.data
        // Преобразуем RegisteredUser в User для совместимости
        const user: User = {
          id: registeredUser.id,
          name: registeredUser.name,
          email: null, // Email не возвращается из registerUserByTelegram
          telegramId: registeredUser.telegramId,
          activated: registeredUser.activated,
          description: (registeredUser as any).description ?? null,
          shortDescription: (registeredUser as any).shortDescription ?? null,
          country: (registeredUser as any).country ?? null,
          city: (registeredUser as any).city ?? null,
          phone: (registeredUser as any).phone ?? null,
          role: {
            id: registeredUser.role.id,
            name: registeredUser.role.name,
            code: registeredUser.role.code,
            description: null
          },
          blockReasons: (registeredUser as any).blockReasons || [],
          createdAt: registeredUser.createdAt,
          updatedAt: new Date().toISOString()
        }
        createUserApiData.value.data = user
        createUserApiData.value.success = true
        createUserApiData.value.message = response.data.registerUserByTelegram.message || 'Пользователь успешно зарегистрирован'
        return user
      } else {
        const errorMsg = response.data?.registerUserByTelegram?.error || response.data?.registerUserByTelegram?.message || 'Не удалось зарегистрировать пользователя'
        createUserApiData.value.error = true
        createUserApiData.value.message = errorMsg
        return null
      }
    } catch (error: any) {
      const errorMessage = error?.message || error?.graphQLErrors?.[0]?.message || 'Ошибка регистрации пользователя'
      createUserApiData.value.error = true
      createUserApiData.value.message = errorMessage
      return null
    } finally {
      createUserApiData.value.loading = false
    }
  }

  // Инициализация при загрузке store
  const init = async () => {
    // Для Telegram Mini App авторизация происходит через telegramId
    // Сначала пытаемся получить telegramId из WebApp (если доступен)
    let telegramIdToCheck: string | null = null
    let telegramIdFromWebApp = false
    
    try {
      // Пробуем получить telegramId из WebApp
      const WebApp = (window as any).Telegram?.WebApp || (window as any).WebApp
      if (WebApp?.initDataUnsafe?.user?.id) {
        telegramIdToCheck = WebApp.initDataUnsafe.user.id.toString()
        telegramIdFromWebApp = true
      } else if (WebApp?.initData) {
        // Пробуем распарсить initData
        try {
          const initData = new URLSearchParams(WebApp.initData)
          const userData = initData.get('user')
          if (userData) {
            const userObj = JSON.parse(decodeURIComponent(userData))
            if (userObj?.id) {
              telegramIdToCheck = userObj.id.toString()
              telegramIdFromWebApp = true
            }
          }
        } catch (e) {
          console.warn('Не удалось распарсить initData:', e)
        }
      }
    } catch (e) {
      console.warn('Не удалось получить telegramId из WebApp:', e)
    }
    
    // Если не получили из WebApp, проверяем сохраненный в sessionStorage
    if (!telegramIdToCheck) {
      telegramIdToCheck = getTelegramId()
    }
    
    if (telegramIdToCheck) {
      // Сохраняем telegramId в sessionStorage, если его там еще нет
      if (!getTelegramId()) {
        setTelegramId(telegramIdToCheck)
      }
      
      // Если есть telegramId из WebApp (первый запуск), всегда используем loginByTelegramId
      // Не используем токены из cookies при первом запуске
      if (telegramIdFromWebApp) {
        console.log('Первый запуск приложения, получаем telegramId из WebApp:', telegramIdToCheck)
        // Очищаем старые токены из cookies при первом запуске
        if (accessToken.value || refreshToken.value) {
          console.log('Очищаем старые токены при первом запуске')
          clearTokens()
        }
      }
      
      // Загружаем пользователя по telegramId
      try {
        const foundUser = await getUserByTelegramIdAction(telegramIdToCheck)
        if (foundUser) {
          setUser(foundUser)
          
          // Если пользователь найден и активирован, всегда получаем токены через loginByTelegramId
          // Это гарантирует, что токены актуальны и соответствуют текущему telegramId
          if (foundUser.activated) {
            console.log('Пользователь активирован, получаем токены через loginByTelegramId:', telegramIdToCheck)
            try {
              const { loginByTelegramId } = await import('@/graphql/services/user')
              const loginResult = await loginByTelegramId(telegramIdToCheck)
              console.log('Результат loginByTelegramId:', loginResult.data?.loginByTelegramId?.successfully)
              
              if (loginResult.data?.loginByTelegramId?.successfully && loginResult.data.loginByTelegramId.data) {
                const authData = loginResult.data.loginByTelegramId.data
                setTokens({
                  accessToken: authData.accessToken,
                  refreshToken: authData.refreshToken
                })
                // Обновляем данные пользователя из ответа
                const userData = authData.user as any
                setUser({
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
                  blockReasons: foundUser.blockReasons || [],
                  specializations: userData.specializations || [],
                  createdAt: foundUser.createdAt,
                  updatedAt: foundUser.updatedAt
                })
              }
            } catch (error) {
              console.warn('Не удалось получить токены при инициализации:', error)
            }
          }
        }
      } catch (error) {
        // Если не удалось загрузить пользователя, очищаем telegramId
        sessionStorage.removeItem(TELEGRAM_ID_KEY)
      }
      
      return
    }
    
    // Если нет telegramId, используем токены из cookies (для обычной авторизации)
    const tokenFromCookie = Cookies.get(ACCESS_TOKEN_KEY)
    const refreshTokenFromCookie = Cookies.get(REFRESH_TOKEN_KEY)
    
    if (tokenFromCookie && !accessToken.value) {
      accessToken.value = tokenFromCookie
    }
    if (refreshTokenFromCookie && !refreshToken.value) {
      refreshToken.value = refreshTokenFromCookie
    }
    
    // Если есть токены, но нет пользователя, загружаем пользователя
    if (accessToken.value && !currentUser.value) {
      try {
        await fetchCurrentUser()
      } catch (error) {
        console.warn('Не удалось загрузить пользователя при инициализации:', error)
      }
    }

    // Если есть токены, но нет пользователя, загружаем пользователя
    if (accessToken.value && !currentUser.value) {
      try {
        await fetchCurrentUser()
      } catch (error) {
        // Если не удалось получить пользователя, пытаемся обновить токен
        if (refreshToken.value) {
          await refreshTokenAction()
          // Проверяем результат через состояние refreshTokenApiData
          if (refreshTokenApiData.value.error) {
            // Если обновление не удалось, очищаем токены
            clearTokens()
          }
        } else {
          clearTokens()
        }
      }
    }
  }

  return {
    // State
    currentUser,
    accessToken,
    refreshToken,
    
    // API States
    getUserByTelegramIdApiData,
    getCurrentUserApiData,
    loginApiData,
    refreshTokenApiData,
    activateUserApiData,
    createUserApiData,
    
    // Getters
    currentUserGetters,
    accessTokenGetters,
    refreshTokenGetters,
    isAuthenticated,
    isBlocked,
    blockReasons,
    
    // API Data Getters
    getUserByTelegramIdApiDataGetters,
    getCurrentUserApiDataGetters,
    loginApiDataGetters,
    refreshTokenApiDataGetters,
    activateUserApiDataGetters,
    createUserApiDataGetters,
    
    // Actions
    loginAction,
    refreshTokenAction,
    fetchCurrentUser,
    logoutAction,
    getUserByTelegramIdAction,
    activateUserAction,
    createUserAction,
    init,
    setTokens,
    clearTokens,
    setUser,
    setTelegramId,
    getTelegramId,
    
    // Utility functions
    createDefaultApiState,
    resetApiState
  }
})
