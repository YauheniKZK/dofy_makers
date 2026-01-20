<template>
  <div class="flex flex-col gap-2">
    <span class="text-[#000000] text-lg font-bold">{{ $t('about_me_title') }}</span>
    <n-blockquote>
      <span v-if="userDescription && userDescription.length > 0" class="text-[#000000] text-sm">{{ userDescription }}</span>
      <n-button  text @click="handleEditDescription">
        <div class="flex items-center gap-2">              
          <n-icon :size="14" color="#a7a4a4">
            <Edit />
          </n-icon>
          <span class="text-[#a7a4a4] text-sm">{{ $t('edit_description') }}</span>
        </div>
      </n-button>
    </n-blockquote>
    <Drawer :showModal="showEditDescriptionModal" :isShowCloseButton="true" @close="showEditDescriptionModal = false">
      <template #content>
        <quill-editor
          ref="editorFR"
          theme="snow"
          style="min-height: 280px;"
          v-model:content="dataForm"
          @ready="editorEvent"
          @update:content="(content) => changeContent(content, 'fr')"
          placeholder="Enter description"
          @focus="(event) => focusEditor(event, 'fr')"
          maxlength="6"
          :toolbar="[
            {'header': ['normal', 3, 2, 1]},
            'bold',
            'italic',
            'underline',
            'strike',
            'link',
            { 'list': 'ordered'},
            { 'list': 'bullet' },
            { 'align': [] },
            { 'color': [] },
            { 'background': [] },
            'code-block'
          ]"
        />
      </template>
    </Drawer>
  </div>
</template>

<script setup lang="ts">
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import Drawer from '@/components/ui/Drawer.vue'
import { ref, computed } from 'vue'
import { NButton, NIcon, NBlockquote } from 'naive-ui'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { Edit } from '@vicons/carbon'
const userStore = useUserStore()
const { currentUser } = storeToRefs(userStore)
const userDescription = computed(() => {
  return currentUser.value?.description || ''
})
const showEditDescriptionModal = ref(false)
const editor = ref<InstanceType<typeof QuillEditor>>()
const dataForm = ref('')
const changeContent = (content: string, lang: string) => {
  dataForm.value = content
}
const editorEvent = () => {
  console.log('editorEvent')
}
const focusEditor = (event: Event, lang: string) => {
  console.log('focusEditor', event)
}
const handleEditDescription = () => {
  showEditDescriptionModal.value = true
}
</script>