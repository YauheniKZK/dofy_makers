<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, nextTick } from 'vue'
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

// Состояние для поднятого элемента формы
const liftedElement = ref<HTMLElement | null>(null)
const originalPosition = ref<{ top: number; left: number; width: number } | null>(null)
const overlayVisible = ref(false)
const overlayElement = ref<HTMLElement | null>(null)
const liftedContainer = ref<HTMLElement | null>(null)

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

// Найти родительский контейнер элемента формы
const findFormContainer = (element: HTMLElement): HTMLElement | null => {
  let current: HTMLElement | null = element
  
  // Ищем контейнер Naive UI
  while (current && current !== document.body) {
    if (current.classList.contains('n-input') || 
        current.classList.contains('n-textarea') ||
        current.classList.contains('n-select') ||
        current.classList.contains('n-base-selection') ||
        current.classList.contains('n-form-item')) {
      return current
    }
    current = current.parentElement
  }
  
  // Если не нашли контейнер Naive UI, возвращаем сам элемент если это input/textarea
  if (element.tagName === 'INPUT' || element.tagName === 'TEXTAREA' || element.tagName === 'SELECT') {
    return element.parentElement || element
  }
  
  return null
}

// Поднять элемент формы к верху экрана
const liftFormElement = async (element: HTMLElement) => {
  const container = findFormContainer(element)
  if (!container) return
  
  // Сохраняем оригинальную позицию
  const rect = container.getBoundingClientRect()
  originalPosition.value = {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width
  }
  
  liftedElement.value = container
  
  // Создаем overlay если его еще нет
  if (!overlayElement.value) {
    const overlay = document.createElement('div')
    overlay.className = 'form-input-overlay'
    overlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-color: rgba(0, 0, 0, 0.5);
      z-index: 2998;
      opacity: 0;
      transition: opacity 0.3s ease;
    `
    document.body.appendChild(overlay)
    overlayElement.value = overlay
    
    // Показываем overlay с анимацией
    await nextTick()
    requestAnimationFrame(() => {
      if (overlayElement.value) {
        overlayElement.value.style.opacity = '1'
      }
    })
  } else {
    overlayElement.value.style.opacity = '1'
  }
  
  overlayVisible.value = true
  
  // Клонируем элемент
  const clone = container.cloneNode(true) as HTMLElement
  clone.className = container.className + ' form-input-lifted'
  clone.style.cssText = `
    position: fixed;
    top: ${rect.top}px;
    left: ${rect.left}px;
    width: ${rect.width}px;
    z-index: 2999;
    transition: top 0.3s ease, left 0.3s ease, width 0.3s ease;
    pointer-events: auto;
  `
  
  // Делаем оригинальный элемент невидимым
  container.style.opacity = '0'
  container.style.pointerEvents = 'none'
  
  document.body.appendChild(clone)
  liftedContainer.value = clone
  
  // Анимируем перемещение вверх
  await nextTick()
  requestAnimationFrame(() => {
    if (liftedContainer.value) {
      const topPosition = Math.max(20, window.innerHeight * 0.1) // 10% от высоты экрана или минимум 20px
      const padding = 16
      liftedContainer.value.style.top = `${topPosition}px`
      liftedContainer.value.style.left = `${padding}px`
      liftedContainer.value.style.width = `${window.innerWidth - padding * 2}px`
    }
  })
  
  // Синхронизируем значения между оригиналом и клоном
  const originalInput = container.querySelector('input, textarea, select') as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  const clonedInput = clone.querySelector('input, textarea, select') as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  
  if (originalInput && clonedInput) {
    // Копируем значение
    if ('value' in clonedInput && 'value' in originalInput) {
      clonedInput.value = originalInput.value
    }
    
    // Синхронизация при вводе
    const syncValues = () => {
      if ('value' in clonedInput && 'value' in originalInput) {
        originalInput.value = clonedInput.value
        originalInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
    }
    
    clonedInput.addEventListener('input', syncValues)
    clonedInput.addEventListener('change', syncValues)
    
    // Фокусируем клонированный элемент
    clonedInput.focus()
    
    // Сохраняем обработчики для очистки
    ;(clone as any)._syncHandlers = { syncValues, clonedInput, originalInput }
  }
}

// Вернуть элемент на место
const returnFormElement = async () => {
  if (!liftedContainer.value || !liftedElement.value || !originalPosition.value) return
  
  const container = liftedContainer.value
  const original = liftedElement.value
  
  // Финальная синхронизация значений перед возвратом
  const clonedInput = container.querySelector('input, textarea, select') as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  const originalInput = original.querySelector('input, textarea, select') as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  
  if (clonedInput && originalInput && 'value' in clonedInput && 'value' in originalInput) {
    originalInput.value = clonedInput.value
    // Триггерим события для Vue реактивности
    originalInput.dispatchEvent(new Event('input', { bubbles: true }))
    originalInput.dispatchEvent(new Event('change', { bubbles: true }))
  }
  
  // Удаляем обработчики синхронизации
  const syncHandlers = (container as any)._syncHandlers
  if (syncHandlers) {
    clonedInput?.removeEventListener('input', syncHandlers.syncValues)
    clonedInput?.removeEventListener('change', syncHandlers.syncValues)
  }
  
  // Анимируем возврат на место
  container.style.top = `${originalPosition.value.top}px`
  container.style.left = `${originalPosition.value.left}px`
  container.style.width = `${originalPosition.value.width}px`
  
  // Скрываем overlay
  if (overlayElement.value) {
    overlayElement.value.style.opacity = '0'
  }
  
  // Ждем завершения анимации
  await new Promise(resolve => setTimeout(resolve, 300))
  
  // Восстанавливаем оригинальный элемент
  original.style.opacity = '1'
  original.style.pointerEvents = 'auto'
  
  // Удаляем клон
  if (container.parentNode) {
    container.parentNode.removeChild(container)
  }
  
  // Удаляем overlay
  if (overlayElement.value && overlayElement.value.parentNode) {
    overlayElement.value.parentNode.removeChild(overlayElement.value)
    overlayElement.value = null
  }
  
  // Очищаем состояние
  liftedElement.value = null
  liftedContainer.value = null
  originalPosition.value = null
  overlayVisible.value = false
  
  // Убираем фокус с оригинального элемента чтобы скрыть клавиатуру
  if (originalInput) {
    originalInput.blur()
  }
}

// Обработчик фокуса на элементах формы
const handleFormFocus = async (event: FocusEvent) => {
  const target = event.target as HTMLElement
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
    const input = target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    // Проверяем тип input - пропускаем checkbox, radio, button
    if (input.type === 'checkbox' || input.type === 'radio' || input.type === 'button' || input.type === 'submit') {
      return
    }
    
    // Если уже есть поднятый элемент, сначала возвращаем его
    if (liftedContainer.value && liftedElement.value) {
      const newContainer = findFormContainer(target)
      // Если это не тот же элемент, возвращаем предыдущий
      if (!newContainer || newContainer !== liftedElement.value) {
        await returnFormElement()
        // Небольшая задержка перед поднятием нового элемента
        await new Promise(resolve => setTimeout(resolve, 100))
      } else {
        // Это тот же элемент - не делаем ничего
        return
      }
    }
    
    liftFormElement(target)
  }
}

// Обработчик blur на элементах формы
const handleFormBlur = (event: FocusEvent) => {
  const target = event.target as HTMLElement
  if (!liftedContainer.value) return
  
  // Проверяем, был ли blur на клонированном элементе
  const clonedInput = liftedContainer.value?.querySelector('input, textarea, select') as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  
  if (clonedInput && liftedContainer.value && (target === clonedInput || target.contains(clonedInput) || clonedInput.contains(target))) {
    // Небольшая задержка чтобы проверить, не переключился ли фокус на другой элемент
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement
      
      // Если фокус не на клонированном элементе или его родителе, возвращаем элемент
      if (!activeElement || !liftedContainer.value ||
          (activeElement !== clonedInput && 
           !clonedInput.contains(activeElement) && 
           activeElement !== liftedContainer.value &&
           !liftedContainer.value.contains(activeElement))) {
        returnFormElement()
      }
    }, 150)
  } else if (liftedElement.value && target) {
    // Blur на оригинальном элементе - проверяем, не переключился ли фокус на клон
    setTimeout(() => {
      const activeElement = document.activeElement as HTMLElement
      if (!activeElement || 
          (activeElement !== clonedInput && 
           !liftedContainer.value?.contains(activeElement))) {
        // Фокус не на клоне - возвращаем элемент только если это не переход на другой input
        const newContainer = findFormContainer(activeElement)
        if (!newContainer || newContainer === liftedElement.value) {
          returnFormElement()
        }
      }
    }, 150)
  }
}

// Обработчик клика для скрытия клавиатуры
const handleClickOutside = (event: MouseEvent | TouchEvent) => {
  const target = event.target as HTMLElement
  
  // Если есть поднятый элемент
  if (liftedContainer.value && overlayElement.value) {
    // Проверяем, был ли клик на overlay (но не на самом поднятом элементе)
    if (target === overlayElement.value) {
      // Клик на overlay - возвращаем элемент
      returnFormElement()
      return
    }
    
    // Если клик не на поднятом элементе и не на его дочерних элементах
    if (!liftedContainer.value.contains(target) && target !== liftedContainer.value) {
      // Проверяем, не кликнули ли на другой элемент формы
      const clickedFormContainer = findFormContainer(target)
      if (!clickedFormContainer || clickedFormContainer !== liftedElement.value) {
        // Клик вне поднятого элемента - возвращаем элемент
        returnFormElement()
        return
      }
    }
  }
  
  // Если есть активный элемент формы (но нет поднятого элемента)
  if (!liftedContainer.value) {
    const activeElement = document.activeElement as HTMLElement
    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA')) {
      // Проверяем, был ли клик на элементе формы или его родителе
      if (!isFormElement(target)) {
        // Клик был вне формы - скрываем клавиатуру
        activeElement.blur()
      }
    }
  }
}

onMounted(() => {
  // Добавляем обработчики для фокуса и blur
  document.addEventListener('focusin', handleFormFocus, true)
  document.addEventListener('focusout', handleFormBlur, true)
  // Добавляем обработчики для клика и тапа
  document.addEventListener('click', handleClickOutside, true)
  document.addEventListener('touchend', handleClickOutside, true)
})

onUnmounted(() => {
  // Удаляем обработчики при размонтировании
  document.removeEventListener('focusin', handleFormFocus, true)
  document.removeEventListener('focusout', handleFormBlur, true)
  document.removeEventListener('click', handleClickOutside, true)
  document.removeEventListener('touchend', handleClickOutside, true)
  
  // Очищаем элементы при размонтировании
  if (liftedContainer.value && liftedContainer.value.parentNode) {
    liftedContainer.value.parentNode.removeChild(liftedContainer.value)
  }
  if (overlayElement.value && overlayElement.value.parentNode) {
    overlayElement.value.parentNode.removeChild(overlayElement.value)
  }
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
