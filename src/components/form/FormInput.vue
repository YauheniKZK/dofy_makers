<template>
  <n-input
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { NInput } from 'naive-ui'

interface Props {
  elementId: string
  modelValue?: string | number
}

interface Emits {
  (e: 'update:modelValue', value: string | number | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
