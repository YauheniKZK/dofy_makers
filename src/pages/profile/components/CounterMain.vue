<template>
  <div class="flex items-center gap-4 px-4">
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <n-icon :size="16" color="#000000">
          <Events />
        </n-icon>
        <span class="text-[#000000] text-sm font-bold">{{ counterFollowers }}</span>
      </div>
      <span class="text-[#808080] text-sm">{{ $t('counter_followers') }}</span>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <n-icon :size="16" color="#000000">
          <Heart24Regular />
        </n-icon>
        <span class="text-[#000000] text-sm font-bold">{{ counterLikes }}</span>
      </div>
      <span class="text-[#808080] text-sm">{{ $t('counter_likes') }}</span>
    </div>
    <div class="flex flex-col">
      <div class="flex items-center gap-2">
        <n-icon :size="18" color="#000000">
          <Workspace />
        </n-icon>
        <span class="text-[#000000] text-sm font-bold">{{ counterProducts }}</span>
      </div>
      <span class="text-[#808080] text-sm">{{ $t('counter_products') }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Events, Workspace } from '@vicons/carbon';
import { Heart24Regular } from '@vicons/fluent';
import { NIcon } from 'naive-ui';

defineProps({
  counterFollowers: {
    type: Number,
    required: true,
    default: 0
  },
  counterLikes: {
    type: Number,
    required: true,
    default: 0
  },
  counterProducts: {
    type: Number,
    required: true,
    default: 0
  }
});
</script>

<style scoped>

</style>