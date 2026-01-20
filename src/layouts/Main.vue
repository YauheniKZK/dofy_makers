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
const isLifting = ref(false) // Флаг процесса поднятия элемента

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
  console.log('[LIFT] liftFormElement вызван')
  const container = findFormContainer(element)
  if (!container) {
    console.log('[LIFT] Контейнер не найден')
    return
  }
  
  console.log('[LIFT] Контейнер найден, начинаем поднятие')
  // Устанавливаем флаг процесса поднятия
  isLifting.value = true
  
  // Сохраняем оригинальную позицию
  const rect = container.getBoundingClientRect()
  originalPosition.value = {
    top: rect.top + window.scrollY,
    left: rect.left + window.scrollX,
    width: rect.width
  }
  
  liftedElement.value = container
  console.log('[LIFT] Состояние установлено', {
    isLifting: isLifting.value,
    hasLiftedElement: !!liftedElement.value
  })
  
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
      pointer-events: auto;
    `
    
    // Overlay должен пропускать клики на поднятый элемент
    // Но блокировать клики вне его
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
    background-color: #fff;
  `
  
  // Убеждаемся, что все интерактивные элементы внутри клона работают
  const interactiveElements = clone.querySelectorAll('input, textarea, select, button')
  interactiveElements.forEach((el: Element) => {
    const htmlEl = el as HTMLElement
    htmlEl.style.pointerEvents = 'auto'
    htmlEl.removeAttribute('disabled')
    htmlEl.removeAttribute('readonly')
  })
  
  // Делаем оригинальный элемент невидимым, но сохраняем его размеры и место в потоке
  // Сохраняем оригинальные стили для восстановления
  const originalHeight = container.offsetHeight
  const originalWidth = container.offsetWidth
  
  container.style.visibility = 'hidden'
  container.style.opacity = '0'
  container.style.pointerEvents = 'none'
  // Сохраняем высоту и ширину, чтобы родительский контейнер не менял размеры
  container.style.minHeight = `${originalHeight}px`
  container.style.height = `${originalHeight}px`
  container.style.minWidth = `${originalWidth}px`
  container.style.width = `${originalWidth}px`
  
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
    
    // Сохраняем обработчики для очистки
    ;(clone as any)._syncHandlers = { syncValues, clonedInput, originalInput }
    
    // Убеждаемся, что клонированный input не disabled и не readonly
    if ('disabled' in clonedInput) {
      (clonedInput as any).disabled = false
    }
    if ('readOnly' in clonedInput) {
      (clonedInput as any).readOnly = false
    }
    
    // Убеждаемся, что элемент интерактивен
    clonedInput.style.pointerEvents = 'auto'
    clonedInput.tabIndex = 0
    
    // Фокусируем клонированный элемент с небольшой задержкой
    // чтобы убедиться, что все DOM операции завершены
    setTimeout(() => {
      console.log('[LIFT] Устанавливаем фокус на клонированный элемент')
      
      // Убираем фокус со всех элементов перед установкой на клон
      if (document.activeElement && document.activeElement !== clonedInput) {
        (document.activeElement as HTMLElement).blur()
      }
      
      // Используем requestAnimationFrame для надежной установки фокуса
      requestAnimationFrame(() => {
        clonedInput.focus({ preventScroll: false })
        console.log('[LIFT] Фокус установлен, activeElement:', document.activeElement?.tagName, 'is:', document.activeElement === clonedInput)
        
        // Проверяем, что фокус действительно установлен
        if (document.activeElement === clonedInput) {
          // Сбрасываем флаг после того как фокус установлен
          setTimeout(() => {
            console.log('[LIFT] Сбрасываем флаг isLifting')
            isLifting.value = false
            console.log('[LIFT] Флаг сброшен, activeElement:', document.activeElement?.tagName)
          }, 200)
        } else {
          console.log('[LIFT] ОШИБКА: Фокус не установлен на клонированный элемент!', {
            expected: clonedInput,
            actual: document.activeElement
          })
          // Пытаемся еще раз
          setTimeout(() => {
            clonedInput.focus({ preventScroll: false })
            if (document.activeElement === clonedInput) {
              setTimeout(() => {
                isLifting.value = false
              }, 200)
            } else {
              console.log('[LIFT] КРИТИЧЕСКАЯ ОШИБКА: Не удалось установить фокус')
              isLifting.value = false
            }
          }, 100)
        }
      })
    }, 150)
  } else {
    console.log('[LIFT] Не найдены input элементы, сбрасываем флаг')
    isLifting.value = false
  }
}

// Вернуть элемент на место
const returnFormElement = async () => {
  console.log('[RETURN] returnFormElement вызван', {
    isLifting: isLifting.value,
    hasLiftedContainer: !!liftedContainer.value,
    hasLiftedElement: !!liftedElement.value
  })
  
  // Не возвращаем элемент во время процесса поднятия
  if (isLifting.value) {
    console.log('[RETURN] Игнорируем - идет процесс поднятия')
    return
  }
  
  if (!liftedContainer.value || !liftedElement.value || !originalPosition.value) {
    console.log('[RETURN] Нет данных для возврата')
    return
  }
  
  console.log('[RETURN] Начинаем возврат элемента')
  // Устанавливаем флаг, чтобы предотвратить обработку blur во время возврата
  isLifting.value = true
  
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
  original.style.visibility = ''
  original.style.opacity = ''
  original.style.pointerEvents = 'auto'
  original.style.minHeight = ''
  original.style.height = ''
  original.style.minWidth = ''
  original.style.width = ''
  
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
  
  // Сбрасываем флаг после завершения возврата
  console.log('[RETURN] Возврат завершен, сбрасываем флаг')
  isLifting.value = false
}

// Обработчик фокуса на элементах формы
const handleFormFocus = async (event: FocusEvent) => {
  const target = event.target as HTMLElement
  console.log('[FOCUS] handleFormFocus вызван', {
    tagName: target?.tagName,
    type: (target as HTMLInputElement)?.type,
    isLifting: isLifting.value,
    hasLiftedContainer: !!liftedContainer.value,
    activeElement: document.activeElement?.tagName
  })
  
  // Игнорируем фокус на других элементах во время поднятия
  if (isLifting.value && target.tagName !== 'INPUT' && target.tagName !== 'TEXTAREA' && target.tagName !== 'SELECT') {
    console.log('[FOCUS] Игнорируем фокус на', target.tagName, '- идет процесс поднятия')
    event.preventDefault()
    event.stopPropagation()
    return
  }
  
  if (target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT')) {
    const input = target as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    // Проверяем тип input - пропускаем checkbox, radio, button
    if (input.type === 'checkbox' || input.type === 'radio' || input.type === 'button' || input.type === 'submit') {
      console.log('[FOCUS] Пропущен тип input:', input.type)
      return
    }
    
    // Проверяем, не является ли это уже клонированным элементом
    const container = findFormContainer(target)
    if (container && container.classList.contains('form-input-lifted')) {
      console.log('[FOCUS] Это уже поднятый элемент, игнорируем')
      return // Это уже поднятый элемент, игнорируем
    }
    
    // Если уже есть поднятый элемент, сначала возвращаем его
    if (liftedContainer.value && liftedElement.value) {
      console.log('[FOCUS] Уже есть поднятый элемент, проверяем...')
      const newContainer = findFormContainer(target)
      // Если это не тот же элемент, возвращаем предыдущий
      if (!newContainer || newContainer !== liftedElement.value) {
        console.log('[FOCUS] Возвращаем предыдущий элемент')
        await returnFormElement()
        // Небольшая задержка перед поднятием нового элемента
        await new Promise(resolve => setTimeout(resolve, 100))
      } else {
        console.log('[FOCUS] Это тот же элемент, не делаем ничего')
        // Это тот же элемент - не делаем ничего
        return
      }
    }
    
    console.log('[FOCUS] Начинаем поднятие элемента')
    // Устанавливаем флаг ДО начала поднятия элемента
    isLifting.value = true
    console.log('[FOCUS] isLifting установлен в true')
    
    // Предотвращаем распространение события
    event.stopPropagation()
    
    liftFormElement(target)
  }
}

// Обработчик blur на элементах формы
const handleFormBlur = (event: FocusEvent) => {
  const target = event.target as HTMLElement
  
  console.log('[BLUR] handleFormBlur вызван', {
    tagName: target?.tagName,
    isLifting: isLifting.value,
    hasLiftedContainer: !!liftedContainer.value,
    hasLiftedElement: !!liftedElement.value,
    activeElement: document.activeElement?.tagName,
    targetIsCloned: target?.closest('.form-input-lifted') !== null
  })
  
  // Игнорируем blur во время процесса поднятия элемента
  if (isLifting.value) {
    console.log('[BLUR] Игнорируем blur - идет процесс поднятия')
    event.stopPropagation()
    return
  }
  
  // Если нет поднятого контейнера, это обычный blur - игнорируем
  if (!liftedContainer.value) {
    console.log('[BLUR] Нет поднятого контейнера, игнорируем')
    return
  }
  
  // Проверяем, был ли blur на оригинальном элементе (который мы скрыли)
  if (liftedElement.value && target) {
    const originalInput = liftedElement.value.querySelector('input, textarea, select') as HTMLElement
    // Если blur на оригинальном элементе - это нормально, фокус переключится на клон
    if (originalInput && (target === originalInput || liftedElement.value.contains(target))) {
      console.log('[BLUR] Blur на оригинальном элементе - это нормально, игнорируем')
      event.stopPropagation()
      return
    }
  }
  
  // Проверяем, был ли blur на клонированном элементе
  const clonedInput = liftedContainer.value?.querySelector('input, textarea, select') as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
  
  if (clonedInput && liftedContainer.value && (target === clonedInput || target.contains(clonedInput) || clonedInput.contains(target))) {
    console.log('[BLUR] Blur на клонированном элементе, проверяем через 200ms...')
    // Небольшая задержка чтобы проверить, не переключился ли фокус на другой элемент
    setTimeout(() => {
      // Проверяем еще раз флаг поднятия
      if (isLifting.value) {
        console.log('[BLUR] Все еще идет процесс поднятия, игнорируем')
        return
      }
      
      const activeElement = document.activeElement as HTMLElement
      console.log('[BLUR] Проверка через 200ms', {
        activeElement: activeElement?.tagName,
        activeElementIsCloned: activeElement === clonedInput || liftedContainer.value?.contains(activeElement),
        willReturn: !activeElement || !liftedContainer.value ||
          (activeElement !== clonedInput && 
           !clonedInput.contains(activeElement) && 
           activeElement !== liftedContainer.value &&
           !liftedContainer.value.contains(activeElement))
      })
      
      // Если фокус не на клонированном элементе или его родителе, возвращаем элемент
      if (!activeElement || !liftedContainer.value ||
          (activeElement !== clonedInput && 
           !clonedInput.contains(activeElement) && 
           activeElement !== liftedContainer.value &&
           !liftedContainer.value.contains(activeElement))) {
        console.log('[BLUR] Возвращаем элемент - фокус потерян')
        returnFormElement()
      } else {
        console.log('[BLUR] Фокус все еще на клонированном элементе, не возвращаем')
      }
    }, 200)
  } else {
    console.log('[BLUR] Blur не на клонированном элементе')
  }
}

// Обработчик клика для скрытия клавиатуры
const handleClickOutside = (event: MouseEvent | TouchEvent) => {
  const target = event.target as HTMLElement
  
  console.log('[CLICK] handleClickOutside вызван', {
    tagName: target?.tagName,
    isLifting: isLifting.value,
    hasLiftedContainer: !!liftedContainer.value,
    targetIsOverlay: target === overlayElement.value,
    targetInLiftedContainer: liftedContainer.value?.contains(target),
    targetIsLiftedContainer: target === liftedContainer.value
  })
  
  // Игнорируем клики во время поднятия элемента
  if (isLifting.value) {
    console.log('[CLICK] Игнорируем клик - идет процесс поднятия')
    return
  }
  
  // Если есть поднятый элемент
  if (liftedContainer.value && overlayElement.value) {
    // Проверяем, был ли клик на самом поднятом элементе или его дочерних элементах
    // Если да - не делаем ничего, элемент должен остаться в фокусе
    if (liftedContainer.value.contains(target) || target === liftedContainer.value) {
      console.log('[CLICK] Клик на поднятом элементе - игнорируем, элемент остается в фокусе')
      return
    }
    
    // Проверяем, был ли клик на overlay
    if (target === overlayElement.value) {
      console.log('[CLICK] Клик на overlay - возвращаем элемент')
      // Клик на overlay - возвращаем элемент
      returnFormElement()
      return
    }
    
    // Клик не на поднятом элементе и не на overlay
    // Проверяем, не кликнули ли на другой элемент формы
    const clickedFormContainer = findFormContainer(target)
    if (!clickedFormContainer || clickedFormContainer !== liftedElement.value) {
      console.log('[CLICK] Клик вне поднятого элемента - возвращаем элемент')
      // Клик вне поднятого элемента - возвращаем элемент
      returnFormElement()
      return
    } else {
      console.log('[CLICK] Клик на другом элементе той же формы - игнорируем')
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
