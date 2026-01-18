<template>
  <div class="flex flex-col gap-4">
    <template v-for="(item, index) in items" :key="getItemKey(item, index)">
      <!-- Группа элементов -->
      <div v-if="isGroup(item)" class="flex flex-col gap-1">
        <h2 v-if="item.title" class="text-base font-semibold text-[#868686]">{{ item.title }}</h2>
        <p v-if="item.description" class="text-xs text-[#868686]">{{ item.description }}</p>
        <div
          v-for="menuItem in item.items"
          :key="menuItem.key"
          class="flex flex-col gap-2"
          @click="navigateTo(menuItem.path)"
        >
          <div class="flex items-center justify-between p-2 bg-[#f6f8f7] rounded-lg cursor-pointer">
            <div class="flex items-center gap-2">
              <div class="flex justify-center items-center min-w-12 h-12 bg-white rounded-lg">
                <n-icon size="24">
                  <component :is="menuItem.icon" />
                </n-icon>
              </div>
            
              <span>{{ menuItem.label }}</span>
            </div>
            <div class="flex items-center gap-2">
              <div v-if="menuItem.counter !== null && menuItem.counter !== undefined" class="flex items-center justify-center rounded-md bg-[#46707e] w-5 h5">
                <span  class="text-xs font-medium text-white">
                  {{ menuItem.counter }}
                </span>
              </div>
              <n-icon size="16">
                <ChevronRight />
              </n-icon>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Одиночный элемент меню -->
      <div
        v-else
        class="flex flex-col gap-2"
        @click="navigateTo(item.path)"
      >
        <div class="flex items-center justify-between p-2 bg-[#f6f8f7] rounded-lg cursor-pointer">
          <div class="flex items-center gap-2">
            <div class="flex justify-center items-center min-w-12 h-12 bg-white rounded-lg">
              <n-icon size="24">
                <component :is="item.icon" />
              </n-icon>
            </div>
          
            <span>{{ item.label }}</span>
          </div>
          <div class="flex items-center gap-2">
            <div v-if="item.counter !== null && item.counter !== undefined" class="flex items-center justify-center rounded-md bg-[#46707e] w-5 h-5">
              <span  class="text-xs font-medium text-white">
                {{ item.counter }}
              </span>
            </div>
      
            <n-icon size="16">
              <ChevronRight />
            </n-icon>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { ChevronRight } from '@vicons/carbon'
import { NIcon } from 'naive-ui'
import { useRouter } from 'vue-router'

interface MenuItem {
  icon: any
  label: string
  key: string
  path: string
  counter?: number | null
}

interface MenuGroup {
  title?: string
  description?: string
  items: MenuItem[]
}

type MenuGroupItem = MenuItem | MenuGroup

interface Props {
  items: MenuGroupItem[]
}

defineProps<Props>()

const router = useRouter()

const isGroup = (item: MenuGroupItem): item is MenuGroup => {
  return 'items' in item && Array.isArray(item.items)
}

const getItemKey = (item: MenuGroupItem, index: number): string => {
  if (isGroup(item)) {
    return `group-${index}-${item.title || index}`
  }
  return item.key
}

const navigateTo = (path: string) => {
  router.push(path)
}
</script>

<style scoped></style>
