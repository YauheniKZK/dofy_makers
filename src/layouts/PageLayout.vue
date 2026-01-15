<template>
  <n-scrollbar style="height: calc(100vh - 59px);" class="page-layout">
    <slot name="content" />
  </n-scrollbar>
</template>
<script setup lang="ts">
import { NScrollbar } from 'naive-ui'
</script>
<style scoped></style>