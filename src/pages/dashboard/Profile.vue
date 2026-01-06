<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { NCard, NDescriptions, NDescriptionsItem, NTag, NAvatar, NDivider, NText, NButton, useMessage } from 'naive-ui'
import { Person20Regular, Mail20Regular, Phone20Regular, Location20Regular, DocumentText20Regular, Briefcase20Regular, ShieldCheckmark20Regular } from '@vicons/fluent'
import { sendToChannel } from '@/graphql/services/user'

const userStore = useUserStore()
const { currentUserGetters } = storeToRefs(userStore)
const message = useMessage()

const user = computed(() => currentUserGetters.value)
const sendingMessage = ref(false)

const handleTestSend = async () => {
  if (!user.value) {
    message.error('Пользователь не найден')
    return
  }

  // Проверяем наличие обязательных полей
  if (!user.value.telegramId) {
    message.error('Telegram ID не найден')
    return
  }

  if (!user.value.id) {
    message.error('User ID не найден')
    return
  }

  try {
    sendingMessage.value = true
    const result = await sendToChannel({
      message: `Привет из Mini App! Тестовое сообщение от ${user.value.name}`,
      parseMode: 'HTML',
      telegramId: user.value.telegramId,
      userId: user.value.id
    })

    if (result.data?.sendToChannel?.successfully) {
      message.success('Сообщение успешно отправлено в канал!')
      console.log('Результат отправки:', result.data.sendToChannel.data)
    } else {
      const errorMsg = result.data?.sendToChannel?.error || result.data?.sendToChannel?.message || 'Неизвестная ошибка'
      message.error(`Ошибка отправки: ${errorMsg}`)
    }
  } catch (error: any) {
    const errorMessage = error?.message || 'Ошибка при отправке сообщения'
    message.error(errorMessage)
    console.error('Ошибка отправки:', error)
  } finally {
    sendingMessage.value = false
  }
}

const formatDate = (dateString: string | null | undefined) => {
  if (!dateString) return 'Не указано'
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  } catch {
    return dateString
  }
}

const getInitials = (name: string | null | undefined) => {
  if (!name) return 'U'
  const parts = name.trim().split(' ')
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name[0].toUpperCase()
}
</script>

<template>
  <div class="flex flex-col h-full overflow-y-auto p-4 pb-20">
    <div v-if="user" class="max-w-2xl w-full mx-auto space-y-4">
      <!-- Заголовок профиля -->
      <n-card>
        <div class="flex items-center gap-4">
          <n-avatar
            :size="80"
            round
            :style="{ backgroundColor: '#18a058', fontSize: '32px' }"
          >
            {{ getInitials(user.name) }}
          </n-avatar>
          <div class="flex-1">
            <h1 class="text-2xl font-bold text-gray-900 mb-1">{{ user.name }}</h1>
            <div class="flex items-center gap-2 flex-wrap">
              <n-tag :type="user.activated ? 'success' : 'warning'" size="small">
                <template #icon>
                  <ShieldCheckmark20Regular />
                </template>
                {{ user.activated ? 'Активирован' : 'Требуется активация' }}
              </n-tag>
              <n-tag type="info" size="small">
                {{ user.role?.name || 'Пользователь' }}
              </n-tag>
            </div>
          </div>
        </div>
      </n-card>

      <!-- Основная информация -->
      <n-card title="Основная информация">
        <n-descriptions :column="1" label-placement="left">
          <n-descriptions-item label="Имя">
            <n-text strong>{{ user.name }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item v-if="user.email" label="Email">
            <div class="flex items-center gap-2">
              <Mail20Regular :size="16" />
              <span>{{ user.email }}</span>
            </div>
          </n-descriptions-item>
          <n-descriptions-item v-if="user.telegramId" label="Telegram ID">
            <n-text type="info">{{ user.telegramId }}</n-text>
          </n-descriptions-item>
          <n-descriptions-item label="Роль">
            <n-tag type="info">{{ user.role?.name || 'Не указано' }}</n-tag>
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <!-- Контактная информация -->
      <n-card v-if="user.phone || user.country || user.city" title="Контактная информация">
        <n-descriptions :column="1" label-placement="left">
          <n-descriptions-item v-if="user.phone" label="Телефон">
            <div class="flex items-center gap-2">
              <Phone20Regular :size="16" />
              <span>{{ user.phone }}</span>
            </div>
          </n-descriptions-item>
          <n-descriptions-item v-if="user.country || user.city" label="Местоположение">
            <div class="flex items-center gap-2">
              <Location20Regular :size="16" />
              <span>
                <template v-if="user.city">{{ user.city }}</template>
                <template v-if="user.city && user.country">, </template>
                <template v-if="user.country">{{ user.country }}</template>
              </span>
            </div>
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <!-- Описание -->
      <n-card v-if="user.shortDescription || user.description" title="О себе">
        <div class="space-y-3">
          <div v-if="user.shortDescription">
            <div class="flex items-center gap-2 mb-2">
              <Briefcase20Regular :size="16" />
              <n-text strong>Краткое описание</n-text>
            </div>
            <n-text>{{ user.shortDescription }}</n-text>
          </div>
          <n-divider v-if="user.shortDescription && user.description" />
          <div v-if="user.description">
            <div class="flex items-center gap-2 mb-2">
              <DocumentText20Regular :size="16" />
              <n-text strong>Описание</n-text>
            </div>
            <n-text>{{ user.description }}</n-text>
          </div>
        </div>
      </n-card>

      <!-- Дополнительная информация -->
      <n-card title="Дополнительная информация">
        <n-descriptions :column="1" label-placement="left">
          <n-descriptions-item label="Дата регистрации">
            {{ formatDate(user.createdAt) }}
          </n-descriptions-item>
          <n-descriptions-item label="Последнее обновление">
            {{ formatDate(user.updatedAt) }}
          </n-descriptions-item>
          <n-descriptions-item label="ID пользователя">
            <n-text type="info" code>{{ user.id }}</n-text>
          </n-descriptions-item>
        </n-descriptions>
      </n-card>

      <!-- Тестовая кнопка отправки в канал -->
      <n-card title="Тестирование">
        <div class="flex flex-col gap-2">
          <n-text>Отправить тестовое сообщение в канал Telegram</n-text>
          <n-button
            type="primary"
            :loading="sendingMessage"
            :disabled="sendingMessage"
            @click="handleTestSend"
            block
          >
            Отправить тестовое сообщение
          </n-button>
        </div>
      </n-card>
    </div>

    <div v-else class="flex items-center justify-center h-full">
      <n-card>
        <div class="text-center text-gray-500">
          <Person20Regular :size="48" class="mx-auto mb-2 opacity-50" />
          <p>Информация о пользователе не загружена</p>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-descriptions-label) {
  font-weight: 500;
  color: #6b7280;
}

:deep(.n-card-header) {
  font-weight: 600;
  font-size: 1.125rem;
}
</style>
