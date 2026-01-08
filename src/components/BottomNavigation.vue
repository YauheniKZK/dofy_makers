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
  <nav class="bottom-nav-minimal safe-area-inset-bottom">
    <div class="flex justify-around items-center h-16 px-2">
      <button
        v-for="item in navItems"
        :key="item.path"
        @click="navigate(item.path)"
        :class="[
          'nav-item',
          isActive(item.path) ? 'nav-item-active' : ''
        ]"
      >
        <div class="nav-icon-wrapper">
          <component :is="item.icon" :size="22" />
        </div>
        <span class="nav-label">{{ item.name }}</span>
      </button>
    </div>
  </nav>
</template>

<style scoped>
.bottom-nav-minimal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(20px);
  border-top: 1px solid #e2e8f0;
  box-shadow: 0 -1px 10px 0 rgb(0 0 0 / 0.05);
  z-index: 9999;
  padding-bottom: env(safe-area-inset-bottom);
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1;
  height: 100%;
  transition: all 0.2s ease;
  color: #64748b;
  position: relative;
  padding: 4px 0;
}

.nav-item:hover {
  color: #3b82f6;
}

.nav-item-active {
  color: #3b82f6;
}

.nav-item-active .nav-icon-wrapper {
  transform: translateY(-2px);
}

.nav-icon-wrapper {
  transition: transform 0.2s ease;
  margin-bottom: 2px;
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
  transition: all 0.2s ease;
}

.nav-item-active .nav-label {
  font-weight: 600;
}
</style>
