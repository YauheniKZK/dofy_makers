<template>
  <div class="flex flex-col grow gap-6 p-4">
    <Search />
    <Recommendations />
  </div>
</template>

<script setup>
import Search from './components/Search.vue'
// import Makers from './components/Makers.vue'
import Recommendations from './components/Recommendations.vue'
</script>