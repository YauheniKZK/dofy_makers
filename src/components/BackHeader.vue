<template>
  <div class="flex items-center gap-2">
    <n-button text @click="handleBack">
      <div class="flex items-center gap-2">
        <n-icon :size="24">
          <ChevronLeft />
        </n-icon>
        <span class="text-base font-bold">{{ titleText }}</span>
      </div>
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft } from '@vicons/carbon'
import { NIcon, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { computed } from 'vue'

interface Props {
  title?: string
  i18nKey?: string
  onBack?: () => void
}

const props = withDefaults(defineProps<Props>(), {
  title: '',
  i18nKey: '',
  onBack: undefined
})

const router = useRouter()
const { t } = useI18n()

const titleText = computed(() => {
  if (props.i18nKey) {
    return t(props.i18nKey)
  }
  return props.title
})

const handleBack = () => {
  if (props.onBack) {
    props.onBack()
  } else {
    router.back()
  }
}
</script>
