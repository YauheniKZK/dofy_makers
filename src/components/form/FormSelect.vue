<template>
  <n-select
    v-bind="$attrs"
    :model-value="modelValue"
    :class="{ 'active-form-el': activeElementId === elementId }"
    @update:model-value="emit('update:modelValue', $event)"
    @update:value="emit('update:modelValue', $event)"
    @focus="onFocus"
    @blur="onBlur"
    @update:show="onSelectShow"
  />
</template>

<script setup lang="ts">
import { inject, ref, type Ref } from 'vue'
import { NSelect } from 'naive-ui'

interface Props {
  elementId: string
  modelValue?: string | number | null
}

interface Emits {
  (e: 'update:modelValue', value: string | number | null): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const activeElementId = inject<Ref<string | null>>('activeElementId', ref(null))
const handleFocus = inject<(elementId: string) => void>('handleFocus', () => {})
const handleBlur = inject<() => void>('handleBlur', () => {})
const handleSelectShow = inject<(show: boolean, elementId: string) => void>('handleSelectShow', () => {})

const onFocus = () => {
  handleFocus(props.elementId)
}

const onBlur = () => {
  handleBlur()
}

const onSelectShow = (show: boolean) => {
  handleSelectShow(show, props.elementId)
}
</script>
