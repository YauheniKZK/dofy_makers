<template>
  <div class="flex flex-col grow gap-6 p-4">
    <BackHeader i18n-key="products_title" />
    <div class="flex flex-col gap-4">
      <n-float-button
        :right="16"
        :bottom="90"
        :square="true"
        width="56"
        height="56"
        class="float-button"
        :class="{ 'float-button-enter': showFloatButton }"
      >
        <n-icon :size="32">
          <Add @click="showModalAddProduct = true" />
        </n-icon>
      </n-float-button>
    </div>
    <Drawer :showModal="showModalAddProduct" @close="handleClose" height="95%" isShowCloseButton>
      <template #content>
        <AddProduct />
      </template>
    </Drawer>
  </div>
</template>

<style scoped>
.float-button {
  opacity: 0;
  transform: translateX(100px);
  transition: none;
}

.float-button-enter {
  animation: slideInFromRight 0.5s cubic-bezier(0.4, 0.0, 0.2, 1) forwards;
}

@keyframes slideInFromRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
</style>

<script setup lang="ts">
import { NIcon, NFloatButton } from 'naive-ui'
import { Add } from '@vicons/carbon'
import Drawer from '@/components/ui/Drawer.vue'
import { ref, onMounted } from 'vue'
import AddProduct from './components/products/AddProduct.vue'
import BackHeader from '@/components/BackHeader.vue'

const showModalAddProduct = ref(false)
const showFloatButton = ref(false)

const handleClose = () => {
  showModalAddProduct.value = false
}

onMounted(() => {
  setTimeout(() => {
    showFloatButton.value = true
  }, 200)
})
</script>