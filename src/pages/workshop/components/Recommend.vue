<template>
  <div class="flex flex-col gap-4 bg-[#e9f2fb] rounded-lg p-4">
    <n-empty>
      <template #default>
        <span class="text-sm text-center flex justify-center">{{ t('empty_recommend_description') }}</span>
      </template>
      <template #icon>
        <n-icon>
          <Recommend />
        </n-icon>
      </template>
      <template #extra>
        <DButton :title="$t('empty_recommend_button')" :color="'#000000'" :textColor="'white'" @click="handleRecommend" />
      </template>
    </n-empty>
    <Drawer :showModal="showModalAddRecommend" @close="handleClose" height="95%" isShowCloseButton>
      <template #content>
        <div class="flex flex-col gap-4 grow">
          <div class="flex flex-col grow justify-center">
            <n-empty>
              <template #default>
                <span class="text-base text-center">{{ t('empty_product_description') }}</span>
              </template>
              <template #icon>
                <n-icon>
                  <Workspace />
                </n-icon>
              </template>
            </n-empty>
          </div>
        </div>
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { Recommend, Workspace } from '@vicons/carbon'
import { NEmpty, NIcon, NButton } from 'naive-ui'
import { useI18n } from 'vue-i18n'
import DButton from '@/components/ui/DButton.vue'
import Drawer from '@/components/ui/Drawer.vue'
import { ref } from 'vue'

const { t } = useI18n()

const showModalAddRecommend = ref(false)

const handleRecommend = () => {
  console.log('handleRecommend')
  showModalAddRecommend.value = true
}

const handleClose = () => {
  showModalAddRecommend.value = false
}
</script>

<style scoped>

</style>