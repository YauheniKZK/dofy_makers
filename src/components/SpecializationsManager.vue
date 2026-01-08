<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSpecializationStore } from '@/stores/specialization'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import {
  NCard,
  NTag,
  NButton,
  NSpin,
  NEmpty,
  NModal,
  NSelect,
  NForm,
  NFormItem,
  NInput,
  useMessage,
  NText,
  NDivider,
  NPopconfirm
} from 'naive-ui'
import { Add20Regular, Dismiss20Regular, Briefcase20Regular } from '@vicons/fluent'
import type { Specialization } from '@/graphql/interface'
import type { CreateSpecializationInput } from '@/graphql/mutations/create-specialization'

const specializationStore = useSpecializationStore()
const userStore = useUserStore()
const message = useMessage()
const { currentUserGetters } = storeToRefs(userStore)
const {
  currentUserSpecializationsGetters,
  systemSpecializationsGetters,
  patientSpecializationsGetters,
  getMeWithSpecializationsApiDataGetters,
  attachSpecializationApiDataGetters,
  detachSpecializationApiDataGetters,
  createSpecializationApiDataGetters
} = storeToRefs(specializationStore)

const showAddModal = ref(false)
const showCreateModal = ref(false)
const selectedSpecializationId = ref<string | null>(null)
const loading = ref(false)

// Форма создания специализации
const createForm = ref<CreateSpecializationInput>({
  name: '',
  description: '',
  type: 'patient'
})

const currentUser = computed(() => currentUserGetters.value)
const userSpecializations = computed(() => currentUserSpecializationsGetters.value)
const availableSpecializations = computed(() => [
  ...systemSpecializationsGetters.value,
  ...patientSpecializationsGetters.value
])
const isLoading = computed(() => getMeWithSpecializationsApiDataGetters.value.loading || loading.value)
const isAttaching = computed(() => attachSpecializationApiDataGetters.value.loading)
const isDetaching = computed(() => detachSpecializationApiDataGetters.value.loading)
const isCreating = computed(() => createSpecializationApiDataGetters.value.loading)

// Фильтруем специализации, которые еще не привязаны к пользователю
const availableToAdd = computed(() => {
  const userSpecIds = userSpecializations.value.map(s => s.id)
  return availableSpecializations.value.filter(s => !userSpecIds.includes(s.id))
})

// Опции для селекта
const specializationOptions = computed(() => {
  return availableToAdd.value.map(spec => ({
    label: spec.description ? `${spec.name} - ${spec.description}` : spec.name,
    value: spec.id
  }))
})

// Загружаем данные при монтировании
onMounted(async () => {
  if (currentUser.value) {
    await loadData()
  }
})

const loadData = async () => {
  loading.value = true
  try {
    await Promise.all([
      specializationStore.fetchSystemSpecializations(),
      specializationStore.fetchPatientSpecializations(),
      specializationStore.fetchMeWithSpecializations()
    ])
  } catch (error) {
    console.error('Ошибка загрузки специализаций:', error)
  } finally {
    loading.value = false
  }
}

const handleAddSpecialization = async () => {
  if (!selectedSpecializationId.value || !currentUser.value) {
    message.warning('Выберите специализацию')
    return
  }

  try {
    const result = await specializationStore.attachSpecializationToUserAction({
      userId: currentUser.value.id,
      specializationId: selectedSpecializationId.value
    })

    if (result) {
      message.success('Специализация успешно добавлена')
      showAddModal.value = false
      selectedSpecializationId.value = null
      // Перезагружаем специализации пользователя
      await specializationStore.fetchMeWithSpecializations()
    } else {
      const errorMsg = attachSpecializationApiDataGetters.value.message || 'Ошибка добавления специализации'
      message.error(errorMsg)
    }
  } catch (error: any) {
    message.error(error?.message || 'Ошибка добавления специализации')
  }
}

const handleRemoveSpecialization = async (specializationId: string) => {
  if (!currentUser.value) {
    return
  }

  try {
    const result = await specializationStore.detachSpecializationFromUserAction({
      userId: currentUser.value.id,
      specializationId
    })

    if (result) {
      message.success('Специализация успешно удалена')
      // Перезагружаем специализации пользователя
      await specializationStore.fetchMeWithSpecializations()
    } else {
      const errorMsg = detachSpecializationApiDataGetters.value.message || 'Ошибка удаления специализации'
      message.error(errorMsg)
    }
  } catch (error: any) {
    message.error(error?.message || 'Ошибка удаления специализации')
  }
}

const openAddModal = () => {
  selectedSpecializationId.value = null
  showAddModal.value = true
}

const openCreateModal = () => {
  createForm.value = {
    name: '',
    description: '',
    type: 'patient'
  }
  showCreateModal.value = true
}

const handleCreateSpecialization = async () => {
  if (!createForm.value.name.trim()) {
    message.warning('Введите название специализации')
    return
  }

  try {
    const result = await specializationStore.createSpecializationAction({
      name: createForm.value.name.trim(),
      description: createForm.value.description?.trim() || null,
      type: 'patient' // Всегда создаем пользовательскую специализацию
    })

    if (result) {
      message.success('Специализация успешно создана и добавлена')
      showCreateModal.value = false
      createForm.value = {
        name: '',
        description: '',
        type: 'patient'
      }
      // Перезагружаем специализации пользователя (она автоматически привязана)
      await specializationStore.fetchMeWithSpecializations()
      // Перезагружаем список пользовательских специализаций
      await specializationStore.fetchPatientSpecializations()
    } else {
      const errorMsg = createSpecializationApiDataGetters.value.message || 'Ошибка создания специализации'
      message.error(errorMsg)
    }
  } catch (error: any) {
    message.error(error?.message || 'Ошибка создания специализации')
  }
}

const getSpecializationTypeLabel = (type: 'system' | 'patient') => {
  return type === 'system' ? 'Системная' : 'Пользовательская'
}

const getSpecializationTypeColor = (type: 'system' | 'patient') => {
  return type === 'system' ? 'info' : 'warning'
}
</script>

<template>
  <div class="specializations-manager">
    <div class="specializations-card">
      <div class="specializations-header">
        <div class="header-left">
          <Briefcase20Regular :size="22" class="header-icon" />
          <h3 class="header-title">Специализации</h3>
        </div>
        <div class="header-actions">
          <n-button
            type="info"
            size="small"
            :disabled="isLoading"
            @click="openCreateModal"
            round
            class="action-button"
          >
            <template #icon>
              <Add20Regular />
            </template>
            Создать свою
          </n-button>
          <n-button
            type="primary"
            size="small"
            :disabled="availableToAdd.length === 0 || isLoading"
            @click="openAddModal"
            round
            class="action-button"
          >
            <template #icon>
              <Add20Regular />
            </template>
            Добавить
          </n-button>
        </div>
      </div>

      <n-spin :show="isLoading">
        <div class="specializations-content">
          <div v-if="userSpecializations.length > 0" class="specializations-list">
            <div
              v-for="spec in userSpecializations"
              :key="spec.id"
              class="specialization-item"
            >
              <div class="specialization-content">
                <div class="specialization-header-row">
                  <span class="specialization-name">{{ spec.name }}</span>
                  <n-tag :type="getSpecializationTypeColor(spec.type)" size="small" round>
                    {{ getSpecializationTypeLabel(spec.type) }}
                  </n-tag>
                </div>
                <p v-if="spec.description" class="specialization-description">
                  {{ spec.description }}
                </p>
              </div>
              <n-popconfirm
                positive-text="Удалить"
                negative-text="Отмена"
                @positive-click="handleRemoveSpecialization(spec.id)"
              >
                <template #trigger>
                  <n-button
                    type="error"
                    size="small"
                    :loading="isDetaching"
                    :disabled="isDetaching || isLoading"
                    quaternary
                    round
                    class="remove-button"
                  >
                    <template #icon>
                      <Dismiss20Regular />
                    </template>
                  </n-button>
                </template>
                Вы уверены, что хотите удалить специализацию "{{ spec.name }}"?
              </n-popconfirm>
            </div>
          </div>

          <div v-else class="empty-specializations">
            <div class="empty-icon">💼</div>
            <p class="empty-text">У вас пока нет специализаций</p>
            <div class="empty-actions">
              <n-button
                type="info"
                @click="openCreateModal"
                round
                size="medium"
              >
                Создать свою
              </n-button>
              <n-button
                type="primary"
                :disabled="availableToAdd.length === 0"
                @click="openAddModal"
                round
                size="medium"
              >
                Добавить существующую
              </n-button>
            </div>
          </div>
        </div>
      </n-spin>
    </div>

    <!-- Модальное окно добавления существующей специализации -->
    <n-modal
      v-model:show="showAddModal"
      preset="card"
      title="Добавить специализацию"
      size="medium"
      :bordered="false"
      style="max-width: 500px"
    >
      <n-form>
        <n-form-item label="Специализация">
          <n-select
            v-model:value="selectedSpecializationId"
            :options="specializationOptions"
            placeholder="Выберите специализацию"
            filterable
            :loading="isLoading"
            :disabled="isLoading || availableToAdd.length === 0"
          />
        </n-form-item>
      </n-form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="showAddModal = false">Отмена</n-button>
          <n-button
            type="primary"
            :loading="isAttaching"
            :disabled="!selectedSpecializationId || isAttaching"
            @click="handleAddSpecialization"
          >
            Добавить
          </n-button>
        </div>
      </template>
    </n-modal>

    <!-- Модальное окно создания пользовательской специализации -->
    <n-modal
      v-model:show="showCreateModal"
      preset="card"
      title="Создать свою специализацию"
      size="medium"
      :bordered="false"
      style="max-width: 500px"
    >
      <n-form>
        <n-form-item label="Название" required>
          <n-input
            v-model:value="createForm.name"
            placeholder="Введите название специализации"
            :maxlength="100"
            show-count
            :disabled="isCreating"
          />
        </n-form-item>
        <n-form-item label="Описание">
          <n-input
            v-model:value="createForm.description"
            type="textarea"
            placeholder="Введите описание (необязательно)"
            :rows="3"
            :maxlength="500"
            show-count
            :disabled="isCreating"
          />
        </n-form-item>
        <n-form-item>
          <n-text depth="3" class="text-sm">
            Пользовательская специализация будет автоматически добавлена к вашему профилю.
          </n-text>
        </n-form-item>
      </n-form>

      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="showCreateModal = false" :disabled="isCreating">
            Отмена
          </n-button>
          <n-button
            type="primary"
            :loading="isCreating"
            :disabled="!createForm.name.trim() || isCreating"
            @click="handleCreateSpecialization"
          >
            Создать
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<style scoped>
.specializations-manager {
  width: 100%;
}

.specializations-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.specializations-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  border-color: #cbd5e1;
}

.specializations-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid #f1f5f9;
  flex-wrap: wrap;
  gap: 1rem;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.header-icon {
  color: #3b82f6;
}

.header-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #0f172a;
  margin: 0;
}

.header-actions {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.action-button {
  font-weight: 500;
}

.specializations-content {
  min-height: 100px;
}

.specializations-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.specialization-item {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  transition: all 0.2s ease;
}

.specialization-item:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateX(4px);
}

.specialization-content {
  flex: 1;
  min-width: 0;
}

.specialization-header-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.specialization-name {
  font-weight: 600;
  color: #0f172a;
  font-size: 1rem;
}

.specialization-description {
  color: #64748b;
  font-size: 0.875rem;
  line-height: 1.6;
  margin: 0;
}

.remove-button {
  flex-shrink: 0;
}

.empty-specializations {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-text {
  color: #64748b;
  font-size: 0.95rem;
  margin-bottom: 1.5rem;
}

.empty-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  flex-wrap: wrap;
}

:deep(.n-tag) {
  border-radius: 12px;
  font-weight: 500;
}
</style>
