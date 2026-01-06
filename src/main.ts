import { createApp } from 'vue'
import './assets/style/style.css'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { useUserStore } from './stores/user'
// Импортируем WebApp для инициализации Telegram Mini App
import WebApp from '@twa-dev/sdk'

// Инициализируем WebApp для мобильных устройств
if (WebApp) {
  WebApp.ready()
  WebApp.expand()
  
  // Логируем информацию о WebApp для отладки
  console.log('Telegram WebApp initialized:', {
    platform: WebApp.platform,
    version: WebApp.version,
    initDataUnsafe: WebApp.initDataUnsafe ? 'present' : 'missing',
    initData: WebApp.initData ? 'present' : 'missing'
  })
}

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Инициализация store синхронно перед монтированием
const userStore = useUserStore()
// Инициализация выполняется асинхронно, но store уже создан с токенами из cookies
userStore.init()

app.mount('#app')
