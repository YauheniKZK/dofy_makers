<template>
  <div class="flex flex-col grow gap-6 p-4">
    <BackHeader i18n-key="folders_title" />
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
          <Add @click="handleCreateFolder" />
        </n-icon>
      </n-float-button>
    </div>

    <!-- Список папок -->
    <div v-if="!folderStore.getFoldersApiDataGetters.loading && folders.length > 0" class="flex flex-col gap-4">
      <div
        v-for="folder in folders"
        :key="folder.id"
        class="flex flex-col gap-2 p-4 bg-[#f6f8f7] rounded-lg cursor-pointer"
        @click="() => handleFolderClick(folder.id)"
      >
        <div class="flex items-center justify-between">
          <div class="flex flex-col gap-1">
            <h3 class="text-base font-semibold">{{ folder.name }}</h3>
            <p v-if="folder.description" class="text-sm text-[#868686]">{{ folder.description }}</p>
          </div>
          <div class="flex items-center gap-2">
            <n-button text @click.stop="() => handleEditFolder(folder)">
              <n-icon size="20">
                <Edit />
              </n-icon>
            </n-button>
            <n-button text @click.stop="() => handleDeleteFolder(folder.id)">
              <n-icon size="20">
                <Delete />
              </n-icon>
            </n-button>
          </div>
        </div>
        <div class="flex items-center gap-4 mt-2">
          <div class="flex items-center gap-1 text-sm text-[#868686]">
            <span>{{ folder.products?.length || 0 }}</span>
            <span>{{ $t('folder_products_count') }}</span>
          </div>
          <div class="flex items-center gap-1 text-sm text-[#868686]">
            <span>{{ folder.services?.length || 0 }}</span>
            <span>{{ $t('folder_services_count') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Пустое состояние -->
    <div v-if="!folderStore.getFoldersApiDataGetters.loading && folders.length === 0" class="flex flex-col items-center justify-center gap-4 py-12">
      <p class="text-base text-[#868686]">{{ $t('folder_empty') }}</p>
      <p class="text-sm text-[#868686]">{{ $t('folder_empty_description') }}</p>
    </div>

    <!-- Загрузка -->
    <div v-if="folderStore.getFoldersApiDataGetters.loading" class="flex items-center justify-center py-12">
      <n-spin size="large" />
    </div>

    <!-- Модальное окно для создания/редактирования папки -->
    <Drawer :showModal="showModal" @close="handleCloseModal" isShowCloseButton height="70%">
      <template #content>
        <div class="flex flex-col gap-4">
          <h2 class="text-xl font-semibold">{{ editingFolder ? $t('folder_edit') : $t('folder_create') }}</h2>
          <n-form ref="formRef" :model="formData" :rules="rules">
            <n-form-item :label="$t('folder_name')" path="name">
              <n-input
                v-model:value="formData.name"
                :placeholder="$t('folder_name_placeholder')"
              />
            </n-form-item>
            <n-form-item :label="$t('folder_description')" path="description">
              <n-input
                v-model:value="formData.description"
                type="textarea"
                :placeholder="$t('folder_description_placeholder')"
                :rows="3"
              />
            </n-form-item>
          </n-form>
          <div class="flex gap-2 justify-end">
            <n-button @click="handleCloseModal">{{ $t('folder_cancel') }}</n-button>
            <n-button type="primary" :loading="folderStore.createFolderApiDataGetters.loading || folderStore.updateFolderApiDataGetters.loading" @click="handleSaveFolder">
              {{ $t('folder_save') }}
            </n-button>
          </div>
        </div>
      </template>
    </Drawer>

    <!-- Модальное окно подтверждения удаления -->
    <ModalDialog :showModal="showDeleteModal" @close="handleCloseDeleteModal" width="90%" maxWidth="400px">
      <template #content>
        <div class="flex flex-col gap-4">
          <h2 class="text-xl font-semibold">Удаление папки</h2>
          <p class="text-base">Вы уверены, что хотите удалить эту папку?</p>
          <div class="flex gap-2 justify-end">
            <n-button @click="handleCloseDeleteModal">Отменить</n-button>
            <n-button type="error" :loading="folderStore.deleteFolderApiDataGetters.loading" @click="handleConfirmDelete">
              Удалить
            </n-button>
          </div>
        </div>
      </template>
    </ModalDialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { NFloatButton, NIcon, NButton, NSpin, NForm, NFormItem, NInput } from 'naive-ui'
import { Add, Edit, Delete } from '@vicons/carbon'
import { CheckmarkCircle20Filled, ErrorCircle20Filled } from '@vicons/fluent'
import BackHeader from '@/components/BackHeader.vue'
import Drawer from '@/components/ui/Drawer.vue'
import ModalDialog from '@/components/ui/ModalDialog.vue'
import { useFolderStore } from '@/stores/folder'
import { useRouter } from 'vue-router'
import { useNotification } from '@/composables/useNotification'
import type { Folder } from '@/graphql/queries/get-folders'
import type { FormInst } from 'naive-ui'

const router = useRouter()
const folderStore = useFolderStore()
const { showSuccess, showError } = useNotification()

const showFloatButton = ref(false)
const showModal = ref(false)
const showDeleteModal = ref(false)
const folderToDelete = ref<string | null>(null)
const editingFolder = ref<Folder | null>(null)
const formRef = ref<FormInst | null>(null)

const formData = ref({
  name: '',
  description: ''
})

const folders = computed(() => folderStore.foldersGetters)

const rules = {
  name: {
    required: true,
    message: 'Введите название папки',
    trigger: 'blur'
  }
}

const handleCreateFolder = () => {
  editingFolder.value = null
  formData.value = {
    name: '',
    description: ''
  }
  showModal.value = true
}

const handleEditFolder = (folder: Folder) => {
  editingFolder.value = folder
  formData.value = {
    name: folder.name,
    description: folder.description || ''
  }
  showModal.value = true
}

const handleCloseModal = () => {
  showModal.value = false
  editingFolder.value = null
  formData.value = {
    name: '',
    description: ''
  }
  formRef.value?.restoreValidation()
}

const handleSaveFolder = async () => {
  if (!formRef.value) return

  await formRef.value.validate((errors) => {
    if (errors) return
  }).catch(() => {})

  if (editingFolder.value) {
    // Обновление папки
    const result = await folderStore.updateFolderAction({
      folderId: editingFolder.value.id,
      name: formData.value.name,
      description: formData.value.description || undefined
    })

    if (result) {
      showSuccess(
        'Папка обновлена',
        folderStore.updateFolderApiDataGetters.message || 'Папка успешно обновлена',
        CheckmarkCircle20Filled
      )
      handleCloseModal()
    } else {
      showError(
        'Ошибка обновления',
        folderStore.updateFolderApiDataGetters.message || 'Не удалось обновить папку',
        ErrorCircle20Filled
      )
    }
  } else {
    // Создание папки
    const result = await folderStore.createFolderAction({
      name: formData.value.name,
      description: formData.value.description || undefined
    })

    if (result) {
      showSuccess(
        'Папка создана',
        folderStore.createFolderApiDataGetters.message || 'Папка успешно создана',
        CheckmarkCircle20Filled
      )
      handleCloseModal()
    } else {
      showError(
        'Ошибка создания',
        folderStore.createFolderApiDataGetters.message || 'Не удалось создать папку',
        ErrorCircle20Filled
      )
    }
  }
}

const handleDeleteFolder = (folderId: string) => {
  folderToDelete.value = folderId
  showDeleteModal.value = true
}

const handleCloseDeleteModal = () => {
  showDeleteModal.value = false
  folderToDelete.value = null
}

const handleConfirmDelete = async () => {
  if (!folderToDelete.value) return

  const success = await folderStore.deleteFolderAction(folderToDelete.value)
  if (success) {
    showSuccess(
      'Папка удалена',
      folderStore.deleteFolderApiDataGetters.message || 'Папка успешно удалена',
      CheckmarkCircle20Filled
    )
    handleCloseDeleteModal()
  } else {
    showError(
      'Ошибка удаления',
      folderStore.deleteFolderApiDataGetters.message || 'Не удалось удалить папку',
      ErrorCircle20Filled
    )
  }
}

const handleFolderClick = (folderId: string) => {
  // Переход на страницу с содержимым папки (можно добавить позже)
  router.push(`/workshop/folder-item/${folderId}`)
  
}

onMounted(async () => {
  setTimeout(() => {
    showFloatButton.value = true
  }, 200)
  
  await folderStore.fetchFolders()
})

// Следим за успешным созданием/обновлением папки
watch(() => folderStore.createFolderApiDataGetters.success, (success) => {
  if (success) {
    folderStore.fetchFolders()
  }
})

watch(() => folderStore.updateFolderApiDataGetters.success, (success) => {
  if (success) {
    folderStore.fetchFolders()
  }
})
</script>

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
