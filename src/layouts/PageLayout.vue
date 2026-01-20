<template>
  <div class="page-layout" style="height: calc(100vh - 75px);">
    <slot name="content" />
  </div>
</template>
<script setup lang="ts">
</script>
<style scoped>
.page-layout {
  width: 100%;
  height: 100%;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}
</style>