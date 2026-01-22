<template>
  <n-input-number
    v-bind="$attrs"
    :model-value="modelValue"
    @update:model-value="emit('update:modelValue', $event)"
    @update:value="emit('update:modelValue', $event)"
  />
</template>

<script setup lang="ts">
import { NInputNumber } from 'naive-ui'

interface Props {
  elementId: string
  modelValue?: number | null
}

interface Emits {
  (e: 'update:modelValue', value: number | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()
</script>
