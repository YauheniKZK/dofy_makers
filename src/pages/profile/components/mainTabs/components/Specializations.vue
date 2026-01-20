<template>
  <div class="flex flex-col gap-2">
    <span class="text-[#000000] text-lg font-bold">{{ $t('specializations_title') }}</span>
    <div class="flex flex-wrap gap-2">
      <n-tag
      v-for="spec in specializations"
      :key="spec.id"  
      >
        {{ spec.name }}
      </n-tag>

    </div>
  </div>
</template>

<script setup lang="ts">
import { NTag } from 'naive-ui'
import { useSpecializationStore } from '@/stores/specialization'
import { computed } from 'vue'
import { storeToRefs } from 'pinia'
const specializationStore = useSpecializationStore()
const { getUserSpecializationsApiDataGetters } = storeToRefs(specializationStore)
const specializations = computed(() => getUserSpecializationsApiDataGetters.value?.data || [])
</script>