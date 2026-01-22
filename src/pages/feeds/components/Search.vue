<template>
  <div class="flex flex-col gap-4">
    <div class="flex flex-col gap-2">
      <h1 class="text-2xl font-bold">{{ $t('search_title') }}</h1>
      <p>{{ $t('search_description') }}</p>
    </div>
    <div class="flex flex-col gap-2">
      <FormInput :element-id="'search'" :placeholder="$t('search_placeholder')" />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import FormInput from '@/components/form/FormInput.vue'
const { t } = useI18n()

</script>