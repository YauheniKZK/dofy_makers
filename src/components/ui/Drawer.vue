<script setup lang="ts">
import { NDrawer, NDrawerContent } from 'naive-ui'
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
  }
})

const emit = defineEmits(['close'])

</script>

<template>
  
  <n-drawer :show="showModal" :placement="placement" @update:show="emit('close')">
    <n-drawer-content class="flex flex-col">
      <slot name="content" />
    </n-drawer-content>
  </n-drawer>
</template>

<style scoped></style>
