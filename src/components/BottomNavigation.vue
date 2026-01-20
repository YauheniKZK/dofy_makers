<script setup lang="ts">
import { useRouter, useRoute } from 'vue-router'
import { ChartMultiple20Regular, FolderOpen24Regular, Person20Regular, BroadActivityFeed20Regular, BookDatabase20Regular } from '@vicons/fluent'
import { ToolKit } from '@vicons/carbon'
import { NIcon, NTabs, NTab } from 'naive-ui'
const router = useRouter()
const route = useRoute()

const navItems = [
  {
    name: 'Лента',
    key: 'feeds',
    path: '/feeds',
    icon: BroadActivityFeed20Regular
  },
  {
    name: 'Кладовая',
    path: '/knowledge',
    key: 'knowledge',
    icon: BookDatabase20Regular
  },
  {
    name: 'Мастерская',
    path: '/workshop',
    key: 'workshop',
    icon: ToolKit
  },
  {
    name: 'Профиль',
    path: '/profile',
    key: 'profile',
    icon: Person20Regular
  }
]

const navigate = (value: string) => {
  const item = navItems.find(item => item.key === value)
  if (item) {
    router.push({ path: item.path })
  }
}

</script>

<template>
  <div class="flex pb-4 bottom-navigation">
    <n-tabs type="segment" animated  @update:value="navigate">
      <n-tab v-for="item in navItems" :key="item.key" :name="item.key">
        <div class="flex flex-col items-center">
          <n-icon :size="22">
            <component :is="item.icon" />
          </n-icon>
          <span class="nav-label">{{ item.name }}</span>
        </div>
      </n-tab>
    </n-tabs>
  </div>
</template>

<style scoped>
.bottom-nav-minimal {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  box-shadow: rgba(0, 0, 0, 0.16) 0px -1px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px;
  border-radius: 15px 15px 0 0;
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
  background: transparent;
  color: #354024;
}

.nav-item-active {
  color: #354024;
  background: transparent;
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
