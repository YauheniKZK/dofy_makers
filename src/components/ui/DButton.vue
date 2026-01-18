<script setup lang="ts">
import { NButton } from 'naive-ui'
import { CloseOutlined } from '@vicons/material'

defineProps({
  title: {
    type: String,
    default: 'Button'
  },
  color: {
    type: String,
    default: '#000000'
  },
  textColor: {
    type: String,
    default: 'white'
  }
})

const emit = defineEmits(['click'])

</script>

<template>
  <n-button :color="color" :text-color="textColor" @click="emit('click')">
    <div class="flex items-center gap-4">
      <span>{{ title }}</span>
    </div>
  </n-button>

</template>

<style scoped></style>
