import { useUserStore } from '@/stores/user'
import { ApolloClient, InMemoryCache, from } from '@apollo/client/core'
import { HttpLink } from '@apollo/client/link/http'
import { setContext } from '@apollo/client/link/context'
import { onError } from '@apollo/client/link/error'
import { Config } from '@/config'

// Настройка HTTP-ссылки
const httpLink = new HttpLink({
  uri: Config.GRAPHQL_ENDPOINT || 'http://localhost:4000/graphql',
})

// Настройка авторизационной ссылки
const authLink = setContext((_, { headers }) => {
  const userStore = useUserStore()
  const token = userStore.accessTokenGetters

  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    },
  }
})

// Настройка errorLink для обработки ошибок и автоматического обновления токенов
const errorLink = onError((errorHandler: any) => {
  const { graphQLErrors, networkError } = errorHandler
  
  if (graphQLErrors) {
    graphQLErrors.forEach((error: any) => {
      const message = error.message || ''
      const locations = error.locations
      const path = error.path
      const extensions = error.extensions as any
      
      console.error(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`
      )
      
      // Проверяем, является ли ошибка ошибкой авторизации
      const isUnauthorized = 
        extensions?.code === 'UNAUTHENTICATED' || 
        message.toLowerCase().includes('unauthorized') ||
        message.toLowerCase().includes('authentication')

      if (isUnauthorized) {
        // Пытаемся обновить токен
        const userStore = useUserStore()
        if (userStore.refreshTokenGetters) {
          userStore.refreshTokenAction().then(() => {
            // Проверяем результат через состояние refreshTokenApiData
            if (userStore.refreshTokenApiDataGetters.error) {
              // Если обновление не удалось, перенаправляем на страницу входа
              userStore.logoutAction()
            }
          }).catch(() => {
            userStore.logoutAction()
          })
        } else {
          // Если нет refresh token, перенаправляем на страницу входа
          userStore.logoutAction()
        }
      }
    })
  }

  if (networkError) {
    console.error(`[Network error]: ${networkError}`)
    
    // Проверяем, является ли это ошибкой 401
    const networkErr = networkError as any
    if (networkErr.statusCode === 401) {
      const userStore = useUserStore()
      if (userStore.refreshTokenGetters) {
        userStore.refreshTokenAction().then(() => {
          // Проверяем результат через состояние refreshTokenApiData
          if (userStore.refreshTokenApiDataGetters.error) {
            userStore.logoutAction()
          }
        }).catch(() => {
          userStore.logoutAction()
        })
      } else {
        userStore.logoutAction()
      }
    }
  }
})

// Создание Apollo Client с объединением ссылок
const client = new ApolloClient({
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'network-only',
    },
    query: {
      fetchPolicy: 'network-only',
    },
  },
})

export default client
