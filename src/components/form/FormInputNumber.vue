<template>
  <n-input-number
    v-bind="$attrs"
    :model-value="modelValue"
    :class="{ 'active-form-el': activeElementId === elementId }"
    @update:model-value="emit('update:modelValue', $event)"
    @update:value="emit('update:modelValue', $event)"
    @focus="onFocus"
    @blur="onBlur"
  />
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
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

const activeElementId = inject<Ref<string | null>>('activeElementId', ref(null))
const handleFocus = inject<(elementId: string) => void>('handleFocus', () => {})
const handleBlur = inject<() => void>('handleBlur', () => {})

const onFocus = () => {
  handleFocus(props.elementId)
}

const onBlur = () => {
  handleBlur()
}
</script>
