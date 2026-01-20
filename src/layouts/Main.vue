<script setup lang="ts">
import { computed, onMounted, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import BottomNavigation from '@/components/BottomNavigation.vue'

const route = useRoute()
const userStore = useUserStore()
const { currentUserGetters, isBlocked } = storeToRefs(userStore)

const showBottomNavigation = computed(() => {
  // Показываем навигацию только на страницах dashboard, если есть пользователь и он не заблокирован
  return !!currentUserGetters.value && !isBlocked.value && route.meta?.requiresAuth
})

// Функция для проверки, является ли элемент элементом формы или его родителем
const isFormElement = (element: HTMLElement | null): boolean => {
  if (!element) return false
  
  // Проверяем сам элемент
  const tagName = element.tagName.toLowerCase()
  const isInput = tagName === 'input' || tagName === 'textarea' || tagName === 'select'
  const isForm = tagName === 'form'
  
  // Проверяем классы Naive UI для элементов форм
  const hasFormClass = element.classList.contains('n-input') || 
                       element.classList.contains('n-textarea') ||
                       element.classList.contains('n-select') ||
                       element.classList.contains('n-base-selection') ||
                       element.closest('.n-input') !== null ||
                       element.closest('.n-textarea') !== null ||
                       element.closest('.n-select') !== null ||
                       element.closest('.n-base-selection') !== null ||
                       element.closest('.n-form-item') !== null ||
                       element.closest('form') !== null
  
  return isInput || isForm || hasFormClass
}

// Обработчик клика для скрытия клавиатуры
const handleClickOutside = (event: MouseEvent | TouchEvent) => {
  const target = event.target as HTMLElement
  const activeElement = document.activeElement as HTMLElement
  
  // Если есть активный элемент формы
  if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
    // Проверяем, был ли клик на элементе формы или его родителе
    if (!isFormElement(target)) {
      // Клик был вне формы - скрываем клавиатуру
      activeElement.blur()
    }
  }
}

onMounted(() => {
  // Добавляем обработчики для клика и тапа
  document.addEventListener('click', handleClickOutside, true)
  document.addEventListener('touchend', handleClickOutside, true)
})

onUnmounted(() => {
  // Удаляем обработчики при размонтировании
  document.removeEventListener('click', handleClickOutside, true)
  document.removeEventListener('touchend', handleClickOutside, true)
})
</script>

<template>
  <div class="flex flex-col grow relative">
    <RouterView 
      :class="[
        'flex flex-col grow',
        showBottomNavigation ? 'pb-19' : ''
      ]" 
    />
    <BottomNavigation v-if="showBottomNavigation" />
  </div>
</template>

<style scoped></style>
