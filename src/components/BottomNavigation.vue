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
  background: #CFBB99;
  border-top: 2px solid #B5A082;
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
  transition: background-color 0.2s ease;
  color: #4C3E19;
  position: relative;
  padding: 4px 0;
  border: none;
  background: transparent;
  cursor: pointer;
}

.nav-item:hover {
  background: #C0AB88;
  color: #354024;
}

.nav-item-active {
  color: #354024;
  background: #B5A082;
}

.nav-icon-wrapper {
  margin-bottom: 2px;
}

.nav-label {
  font-size: 11px;
  font-weight: 500;
  margin-top: 2px;
}

.nav-item-active .nav-label {
  font-weight: 600;
}
</style>
