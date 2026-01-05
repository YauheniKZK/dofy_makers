<script setup lang="ts">
import {
  NModal,
  NIcon
} from 'naive-ui'
import { CloseOutlined } from '@vicons/material'

defineProps({
  showModal: {
    type: Boolean,
    default: false
  },
  width: {
    type: String,
    default: '600px'
  },
  maxWidth: {
    type: String,
    default: '100%'
  },
  noMaskColor: {
    type: Boolean,
    default: false
  },
  px: {
    type: String,
    default: '32px'
  },
  py: {
    type: String,
    default: '32px'
  }
})

</script>

<template>
  <n-modal
    :show="showModal"
    preset="card"
    :bordered="false"
    :closable="false"
    class="custom1-card"
    style="padding-bottom: 15px; border-radius: 8px"
    :style="`max-width: ${maxWidth}; width: ${width}`"
    :content-style="`padding-left: ${px};padding-right: ${px};padding-top: 0;padding-bottom: ${py};max-height: 100%`"
    :header-style="'padding-left: 16px;padding-right: 16px;padding-bottom: 0;'"
  >
    <template #header>{{ '' }}</template>
    <template #header-extra>
      <n-icon :size="24" class="cursor-pointer" @click="$emit('close')">
        <CloseOutlined />
      </n-icon>
    </template>
    <slot name="content" />
  </n-modal>
</template>

<style scoped></style>
