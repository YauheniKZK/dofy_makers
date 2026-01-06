<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { Home20Regular, ChartMultiple20Regular, FolderOpen24Regular, Person20Regular } from '@vicons/fluent'

const router = useRouter()
const route = useRoute()

const navItems = [
  {
    name: 'Главная',
    path: '/dashboard',
    icon: Home20Regular
  },
  {
    name: 'Статистика',
    path: '/dashboard/statistics',
    icon: ChartMultiple20Regular
  },
  {
    name: 'Мой каталог',
    path: '/dashboard/catalog',
    icon: FolderOpen24Regular
  },
  {
    name: 'Профиль',
    path: '/dashboard/profile',
    icon: Person20Regular
  }
]

const isActive = (path: string) => {
  // Для главной страницы проверяем точное совпадение
  if (path === '/dashboard') {
    return route.path === '/dashboard'
  }
  // Для остальных страниц проверяем начало пути
  return route.path.startsWith(path)
}

const navigate = (path: string) => {
  router.push(path)
}
</script>

<template>
  <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg z-[9999] safe-area-inset-bottom">
    <div class="flex justify-around items-center h-16 px-2">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigate(item.path)"
        :class="[
          'flex flex-col items-center justify-center flex-1 h-full transition-colors',
          isActive(item.path)
            ? 'text-blue-600'
            : 'text-gray-600 hover:text-gray-900'
        ]"
      >
        <component :is="item.icon" :size="24" />
        <span class="text-xs mt-1">{{ item.name }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.safe-area-inset-bottom {
  padding-bottom: env(safe-area-inset-bottom);
}
</style>
