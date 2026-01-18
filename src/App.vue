<script setup lang="ts">
import { NConfigProvider, NModalProvider, NMessageProvider, NNotificationProvider } from 'naive-ui';
import Main from '@/layouts/Main.vue'
import eruda from 'eruda';

eruda.init();
</script>

<template>
  <n-config-provider class="flex flex-col grow">
    <n-notification-provider>
      <n-message-provider>
        <n-modal-provider>
          <Main />
        </n-modal-provider>
      </n-message-provider>
    </n-notification-provider>
  </n-config-provider>
</template>

<style scoped></style>
  