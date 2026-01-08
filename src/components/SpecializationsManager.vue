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
  useMessage,
  NText,
  NDivider,
  NPopconfirm
} from 'naive-ui'
import { Add20Regular, Dismiss20Regular, Briefcase20Regular } from '@vicons/fluent'
import type { Specialization } from '@/graphql/interface'

const specializationStore = useSpecializationStore()
const userStore = useUserStore()
const message = useMessage()
const { currentUserGetters } = storeToRefs(userStore)
const {
  currentUserSpecializationsGetters,
  systemSpecializationsGetters,
  getMeWithSpecializationsApiDataGetters,
  attachSpecializationApiDataGetters,
  detachSpecializationApiDataGetters
} = storeToRefs(specializationStore)

const showAddModal = ref(false)
const selectedSpecializationId = ref<string | null>(null)
const loading = ref(false)

const currentUser = computed(() => currentUserGetters.value)
const userSpecializations = computed(() => currentUserSpecializationsGetters.value)
const availableSpecializations = computed(() => systemSpecializationsGetters.value)
const isLoading = computed(() => getMeWithSpecializationsApiDataGetters.value.loading || loading.value)
const isAttaching = computed(() => attachSpecializationApiDataGetters.value.loading)
const isDetaching = computed(() => detachSpecializationApiDataGetters.value.loading)

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

const getSpecializationTypeLabel = (type: 'system' | 'patient') => {
  return type === 'system' ? 'Системная' : 'Пользовательская'
}

const getSpecializationTypeColor = (type: 'system' | 'patient') => {
  return type === 'system' ? 'info' : 'warning'
}
</script>

<template>
  <div class="specializations-manager">
    <n-card>
      <template #header>
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2">
            <Briefcase20Regular :size="20" />
            <span class="font-semibold">Специализации</span>
          </div>
          <n-button
            type="primary"
            size="small"
            :disabled="availableToAdd.length === 0 || isLoading"
            @click="openAddModal"
          >
            <template #icon>
              <Add20Regular />
            </template>
            Добавить
          </n-button>
        </div>
      </template>

      <n-spin :show="isLoading">
        <div v-if="userSpecializations.length > 0" class="space-y-2">
          <div
            v-for="spec in userSpecializations"
            :key="spec.id"
            class="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
          >
            <div class="flex-1">
              <div class="flex items-center gap-2 mb-1">
                <n-text strong>{{ spec.name }}</n-text>
                <n-tag :type="getSpecializationTypeColor(spec.type)" size="small">
                  {{ getSpecializationTypeLabel(spec.type) }}
                </n-tag>
              </div>
              <n-text v-if="spec.description" depth="3" class="text-sm">
                {{ spec.description }}
              </n-text>
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

        <n-empty v-else description="У вас пока нет специализаций">
          <template #extra>
            <n-button
              type="primary"
              :disabled="availableToAdd.length === 0"
              @click="openAddModal"
            >
              Добавить специализацию
            </n-button>
          </template>
        </n-empty>
      </n-spin>
    </n-card>

    <!-- Модальное окно добавления специализации -->
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
  </div>
</template>

<style scoped>
.specializations-manager {
  width: 100%;
}
</style>
