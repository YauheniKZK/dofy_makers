<template>
<PageLayout>
    <template #content>
      <div class="flex flex-col grow gap-6">
        <div class="flex flex-col gap-2">
          <h1 class="text-2xl font-bold">{{ $t('workshop_title') }}</h1>
        </div>
      </div>
    </template>
  </PageLayout>
</template>

<script setup>
import PageLayout from '@/layouts/PageLayout.vue'
</script>

<style scoped>

</style>