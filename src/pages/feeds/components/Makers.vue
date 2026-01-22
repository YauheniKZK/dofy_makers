<template>
  <div class="flex flex-col">
    <h1 class="text-2xl font-bold">{{ $t('makers_title') }}</h1>
    <div class="flex flex-col gap-2">
      <n-scrollbar x-scrollable>
        <div class="flex gap-4 pb-2">
          <div
            v-for="maker in makers"
            :key="maker.id"
            class="flex flex-col gap-2 p-4 bg-white rounded-lg shadow-sm min-w-[200px] border border-gray-100"
          >
            <!-- Аватар -->
            <div class="flex justify-center">
              <n-avatar
                :size="64"
                :src="maker.avatar"
                round
              >
                {{ maker.name.charAt(0) }}
              </n-avatar>
            </div>
            
            <!-- Имя -->
            <div class="text-center">
              <h3 class="font-semibold text-base">{{ maker.name }}</h3>
            </div>
            
            <!-- Специализации -->
            <div class="flex flex-wrap gap-1 justify-center">
              <n-tag
                v-for="(spec, index) in maker.specializations"
                :key="index"
                size="small"
                type="info"
              >
                {{ spec }}
              </n-tag>
            </div>
            
            <!-- Рейтинг -->
            <div class="flex items-center justify-center gap-2">
              <n-rate
                :value="maker.rating"
                :count="5"
                readonly
                size="small"
              />
              <span class="text-sm text-gray-600">{{ maker.rating.toFixed(1) }}</span>
            </div>
          </div>
        </div>
      </n-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { NAvatar, NTag, NRate, NScrollbar } from 'naive-ui'

const { t } = useI18n()

// Пример данных мастеров
const makers = ref([
  {
    id: 1,
    name: 'Анна Иванова',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anna',
    specializations: ['Керамика', 'Роспись'],
    rating: 4.8
  },
  {
    id: 2,
    name: 'Петр Смирнов',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Peter',
    specializations: ['Дерево', 'Мебель'],
    rating: 4.6
  },
  {
    id: 3,
    name: 'Мария Козлова',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria',
    specializations: ['Текстиль', 'Вышивка'],
    rating: 4.9
  },
  {
    id: 4,
    name: 'Иван Петров',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ivan',
    specializations: ['Металл', 'Ковка'],
    rating: 4.7
  },
  {
    id: 5,
    name: 'Елена Волкова',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Elena',
    specializations: ['Ювелирка', 'Бижутерия'],
    rating: 5.0
  }
])
</script>