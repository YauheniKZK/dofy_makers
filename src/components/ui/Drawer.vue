<script setup lang="ts">
import { NDrawer, NDrawerContent } from 'naive-ui'
import { NButton, NIcon } from 'naive-ui'
import { CloseOutlined } from '@vicons/material'
import type { PropType } from 'vue'

type DrawerPlacement = 'top' | 'right' | 'bottom' | 'left'

defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  placement: {
    type: String as PropType<DrawerPlacement>,
    default: 'bottom' as DrawerPlacement
  },
  title: {
    type: String,
    default: ''
  },
  height: {
    type: String,
    default: '50%'
  },
  isShowCloseButton: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['close'])

</script>

<template>
  
  <n-drawer :show="showModal" :placement="placement" to=".drawer-container" @update:show="emit('close')" :height="height">
    <n-drawer-content class="flex flex-col" :class="{ 'pt-6': isShowCloseButton }">
      <div class="close-button" v-if="isShowCloseButton">
        <n-button text @click="emit('close')">
          <n-icon size="26">
            <CloseOutlined />
          </n-icon>
        </n-button>
      </div>
      <slot name="content" />
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped>
.close-button {
  position: absolute;
  top: 0px;
  padding: 16px 16px 0 16px;
  right: 0px;
  background: #fff;
  width: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  border-radius: 32px 32px 0 0;
}
</style>
