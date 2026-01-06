<script setup lang="ts">
import { computed } from 'vue'
import { NButton, NIcon } from 'naive-ui'
import { Code20Regular } from '@vicons/fluent'

// Показываем кнопку только в режиме разработки
const isDev = computed(() => import.meta.env.DEV || import.meta.env.MODE === 'development')

const openDevTools = () => {
  // Попытка открыть devtools различными способами
  try {
    // Способ 1: Открыть новое окно с пустой страницей (пользователь может открыть devtools вручную)
    const newWindow = window.open('about:blank', '_blank')
    if (newWindow) {
      newWindow.document.write(`
        <html>
          <head><title>DevTools Helper</title></head>
          <body style="font-family: monospace; padding: 20px;">
            <h2>Инструменты разработчика</h2>
            <p>Для открытия DevTools используйте:</p>
            <ul>
              <li><strong>Windows/Linux:</strong> F12 или Ctrl+Shift+I</li>
              <li><strong>Mac:</strong> Cmd+Option+I</li>
            </ul>
            <p>Или щелкните правой кнопкой мыши на странице и выберите "Inspect" / "Проверить элемент"</p>
            <hr>
            <h3>Полезная информация:</h3>
            <p><strong>User Agent:</strong> ${navigator.userAgent}</p>
            <p><strong>URL:</strong> ${window.location.href}</p>
            <p><strong>Local Storage:</strong> ${Object.keys(localStorage).length} элементов</p>
            <p><strong>Session Storage:</strong> ${Object.keys(sessionStorage).length} элементов</p>
            <button onclick="console.log('Console opened!'); window.close();" style="padding: 10px 20px; margin-top: 20px;">
              Закрыть
            </button>
          </body>
        </html>
      `)
    }
  } catch (error) {
    console.error('Не удалось открыть окно:', error)
    // Альтернативный способ: показать alert с инструкциями
    alert('Для открытия DevTools используйте:\n\nWindows/Linux: F12 или Ctrl+Shift+I\nMac: Cmd+Option+I\n\nИли щелкните правой кнопкой мыши и выберите "Inspect"')
  }
  
  // Также выводим информацию в консоль
  console.log('%c🔧 DevTools Helper', 'color: #18a058; font-size: 20px; font-weight: bold;')
  console.log('%cДля открытия DevTools используйте:', 'color: #2080f0; font-size: 14px;')
  console.log('Windows/Linux: F12 или Ctrl+Shift+I')
  console.log('Mac: Cmd+Option+I')
  console.log('Или щелкните правой кнопкой мыши и выберите "Inspect"')
  console.log('%c─────────────────────────────────────', 'color: #999;')
  console.log('User Agent:', navigator.userAgent)
  console.log('URL:', window.location.href)
  console.log('Local Storage items:', Object.keys(localStorage).length)
  console.log('Session Storage items:', Object.keys(sessionStorage).length)
}
</script>

<template>
  <n-button
    v-if="isDev"
    circle
    type="info"
    size="large"
    :style="{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9998,
      boxShadow: '0 2px 8px rgba(0, 0, 0, 0.15)'
    }"
    @click="openDevTools"
    title="Открыть DevTools (F12)"
  >
    <template #icon>
      <n-icon :size="20">
        <Code20Regular />
      </n-icon>
    </template>
  </n-button>
</template>

<style scoped>
</style>

