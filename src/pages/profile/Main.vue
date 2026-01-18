<template>
  <div class="flex flex-col grow gap-4">
    <div class="flex flex-col gap-2 pb-[60px]">
      <div class="flex bg-[#155a5a] min-h-[160px] relative">
        <div class="flex items-end gap-4 p-4 absolute -bottom-[74px] left-0 w-full">
        <div class="flex">
          <n-avatar
            :size="96"
            :src="userAvatar"
            style="border: 2px solid #fff; border-radius: 15px;"
          />
        </div>
        <div class="flex flex-col gap-1">
          <span class="text-[#000000] text-lg font-bold">{{ userName }}</span>
          <StatusUser />
        </div>
      </div>
      </div>
    </div>
    <CounterMain :counterFollowers="100" :counterLikes="100000" :counterProducts="25" />
    <InfoUser />
    <div class="flex px-4">
      <n-tabs type="segment" animated>
        <n-tab-pane name="about" :tab="t('about_tab')">
          <About />
        </n-tab-pane>
        <n-tab-pane name="statistics" :tab="t('statistics_tab')">
          <Statistics />
        </n-tab-pane>
        <n-tab-pane name="orders">
          <template #tab>
            <div class="flex items-center gap-2">
              <span>{{ t('orders_tab') }}</span>
              <n-badge :value="valueOrders" />
            </div>
          </template>
          <Orders />
        </n-tab-pane>
      </n-tabs>
    </div>
 
  </div>
</template>

<script setup>
import { NAvatar, NButton, NIcon, NTabs, NTabPane, NBadge } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
import { Edit, Location } from '@vicons/carbon'
import { useTelegramUser } from '@/composables/useTelegramUser'
import CounterMain from './components/CounterMain.vue'
import { useI18n } from 'vue-i18n'
import About from './components/mainTabs/About.vue'
import Orders from './components/mainTabs/Orders.vue'
import Statistics from './components/mainTabs/Statistics.vue'
import InfoUser from './components/InfoUser.vue'
import StatusUser from './components/StatusUser.vue'

const { t } = useI18n()

const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)

// Получаем данные из Telegram WebApp (включая аватар)
const { userAvatar: telegramAvatar, userFullName: telegramFullName } = useTelegramUser()

const userName = computed(() => {
  return currentUser.value?.name || telegramFullName.value || 'Unknown'
})

// Используем аватар из данных пользователя, если доступен, иначе из Telegram
const userAvatar = computed(() => {
  return currentUser.value?.avatarUrl || telegramAvatar.value || undefined
})

const userDescription = computed(() => {
  return currentUser.value?.description || ''
})

const valueOrders = computed(() => {
  return 10
})
</script>