<template>
  <div class="route-transition-container">
    <div v-if="showBackButton && canGoBack" class="back-button-container">
      <button class="back-button" @click="handleBack">
        <n-icon size="20">
          <ChevronLeft />
        </n-icon>
        <span class="back-button-text">Назад</span>
      </button>
    </div>
    <div class="route-transition-content">
      <router-view v-slot="{ Component }">
        <transition :name="transitionName">
          <component :is="Component" :key="route.path" />
        </transition>
      </router-view>
    </div>
  </div>
</template>

<script setup lang="ts">
/**
 * Переиспользуемый компонент для анимации переходов между маршрутами в стиле iOS
 * 
 * @example
 * // Простое использование
 * <RouteTransition />
 * 
 * @example
 * // С конфигурацией глубины маршрутов
 * <RouteTransition :config="{
 *   routeDepth: {
 *     'main': 0,
 *     'detail': 1
 *   }
 * }" />
 * 
 * @example
 * // С кнопкой "Назад"
 * <RouteTransition :show-back-button="true" />
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ChevronLeft } from '@vicons/carbon'
import { NIcon } from 'naive-ui'
import { useRouteTransition, type RouteTransitionConfig } from '@/composables/useRouteTransition'

interface Props {
  /**
   * Конфигурация для определения направления переходов
   */
  config?: RouteTransitionConfig
  /**
   * Показывать ли кнопку "Назад"
   */
  showBackButton?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  config: () => ({}),
  showBackButton: false
})

const route = useRoute()
const router = useRouter()
const { transitionName } = useRouteTransition(props.config)

// Проверяем, можно ли вернуться назад (есть ли история)
const canGoBack = computed(() => {
  return window.history.length > 1
})

const handleBack = () => {
  router.back()
}
</script>

<style scoped>
.route-transition-container {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
  display: flex;
  flex-direction: column;
}

.route-transition-content {
  position: relative;
  width: 100%;
  height: 100%;
  flex: 1;
  overflow-y: auto;
  overflow-x: hidden;
}

.back-button-container {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 100;
}

.back-button {
  display: flex;
  align-items: center;
  gap: 4px;
  padding: 8px 12px;
  background: rgba(255, 255, 255, 0.9);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.2s ease;
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 1);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  transform: translateY(-1px);
}

.back-button:active {
  transform: translateY(0);
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
}

.back-button-text {
  font-size: 14px;
  font-weight: 500;
  color: #1A1A1A;
  user-select: none;
}

/* Анимация перехода вперед (слева направо) - как в iOS */
.slide-left-enter-active,
.slide-left-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1),
              opacity 0.35s cubic-bezier(0.4, 0.0, 0.2, 1);
  will-change: transform, opacity;
  overflow-y: auto;
  overflow-x: hidden;
}

.slide-left-enter-from {
  transform: translateX(100%);
  opacity: 0;
}

.slide-left-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-left-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-left-leave-to {
  transform: translateX(-100%);
  opacity: 0.3;
}

/* Анимация перехода назад (справа налево) - как в iOS */
.slide-right-enter-active,
.slide-right-leave-active {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  width: 100%;
  height: 100%;
  transition: transform 0.35s cubic-bezier(0.4, 0.0, 0.2, 1),
              opacity 0.35s cubic-bezier(0.4, 0.0, 0.2, 1);
  will-change: transform, opacity;
  overflow-y: auto;
  overflow-x: hidden;
}

.slide-right-enter-from {
  transform: translateX(-100%);
  opacity: 0.3;
}

.slide-right-enter-to {
  transform: translateX(0);
  opacity: 1;
}

.slide-right-leave-from {
  transform: translateX(0);
  opacity: 1;
}

.slide-right-leave-to {
  transform: translateX(100%);
  opacity: 0;
}
</style>
