<script setup lang="ts">
import { NConfigProvider, NModalProvider, NMessageProvider } from 'naive-ui';
import Main from '@/layouts/Main.vue'
</script>

<template>
  <n-config-provider class="flex flex-col grow">
    <n-message-provider>
      <n-modal-provider>
        <Main />
      </n-modal-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<style scoped></style>
  