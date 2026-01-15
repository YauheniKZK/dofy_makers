<template>
  <div class="flex flex-col grow gap-6 p-4">
    <div class="flex items-center gap-2">
      <n-button text @click="router.back()">
        <div class="flex items-center gap-2">
          <n-icon :size="24">
            <ChevronLeft />
          </n-icon>
          <span class="text-base font-bold">{{ $t('manual_title') }}</span>
        </div>
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft } from '@vicons/carbon'
import { NIcon, NButton } from 'naive-ui'
import { useRouter } from 'vue-router'

const router = useRouter()
</script>