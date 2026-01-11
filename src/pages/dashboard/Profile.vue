<script setup lang="ts">
import { computed, ref } from 'vue'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { NCard, NDescriptions, NDescriptionsItem, NTag, NAvatar, NDivider, NText, NButton, useMessage } from 'naive-ui'
import { Person20Regular, Mail20Regular, Phone20Regular, Location20Regular, DocumentText20Regular, Briefcase20Regular, ShieldCheckmark20Regular } from '@vicons/fluent'
import { sendToChannel } from '@/graphql/services/user'
import SpecializationsManager from '@/components/SpecializationsManager.vue'

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
  const telegramId = user.value.telegramId
  const userId = user.value.id

  if (!telegramId || telegramId === null || telegramId === undefined) {
    message.error('Telegram ID не найден')
    console.error('Telegram ID отсутствует:', user.value)
    return
  }

  if (!userId || userId === null || userId === undefined) {
    message.error('User ID не найден')
    console.error('User ID отсутствует:', user.value)
    return
  }

  try {
    sendingMessage.value = true
    
    // Подготавливаем данные для отправки - явно преобразуем в строки
    const inputData = {
      message: `Привет из Mini App! Тестовое сообщение от ${user.value.name}`,
      parseMode: 'HTML' as const,
      telegramId: String(telegramId),
      userId: String(userId)
    }
    
    // Логируем данные перед отправкой
    console.log('Отправка сообщения с данными:', inputData)
    console.log('Данные пользователя:', {
      id: user.value.id,
      telegramId: user.value.telegramId,
      name: user.value.name
    })
    
    const result = await sendToChannel(inputData)

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
  <div class="profile-page">
    <div v-if="user" class="profile-container">
      <!-- Заголовок профиля -->
      <div class="profile-header-card">
        <div class="profile-header-content">
          <div class="profile-avatar-wrapper">
            <n-avatar
              :size="96"
              round
              class="profile-avatar"
            >
              {{ getInitials(user.name) }}
            </n-avatar>
            <div v-if="user.activated" class="status-badge status-active">
              <ShieldCheckmark20Regular :size="14" />
            </div>
          </div>
          <div class="profile-info">
            <h1 class="profile-name">{{ user.name }}</h1>
            <div class="profile-tags">
              <n-tag :type="user.activated ? 'success' : 'warning'" size="small" round>
                <template #icon>
                  <ShieldCheckmark20Regular />
                </template>
                {{ user.activated ? 'Активирован' : 'Требуется активация' }}
              </n-tag>
              <n-tag type="info" size="small" round>
                {{ user.role?.name || 'Пользователь' }}
              </n-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Основная информация -->
      <div class="info-card">
        <h3 class="card-title">Основная информация</h3>
        <div class="info-list">
          <div class="info-item">
            <div class="info-label">Имя</div>
            <div class="info-value">{{ user.name }}</div>
          </div>
          <div v-if="user.email" class="info-item">
            <div class="info-label">
              <Mail20Regular :size="16" />
              Email
            </div>
            <div class="info-value">{{ user.email }}</div>
          </div>
          <div v-if="user.telegramId" class="info-item">
            <div class="info-label">Telegram ID</div>
            <div class="info-value info-value-code">{{ user.telegramId }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Роль</div>
            <div class="info-value">
              <n-tag type="info" size="small" round>{{ user.role?.name || 'Не указано' }}</n-tag>
            </div>
          </div>
        </div>
      </div>

      <!-- Контактная информация -->
      <div v-if="user.phone || user.country || user.city" class="info-card">
        <h3 class="card-title">Контактная информация</h3>
        <div class="info-list">
          <div v-if="user.phone" class="info-item">
            <div class="info-label">
              <Phone20Regular :size="16" />
              Телефон
            </div>
            <div class="info-value">{{ user.phone }}</div>
          </div>
          <div v-if="user.country || user.city" class="info-item">
            <div class="info-label">
              <Location20Regular :size="16" />
              Местоположение
            </div>
            <div class="info-value">
              <template v-if="user.city">{{ user.city }}</template>
              <template v-if="user.city && user.country">, </template>
              <template v-if="user.country">{{ user.country }}</template>
            </div>
          </div>
        </div>
      </div>

      <!-- Описание -->
      <div v-if="user.shortDescription || user.description" class="info-card">
        <h3 class="card-title">О себе</h3>
        <div class="description-content">
          <div v-if="user.shortDescription" class="description-section">
            <div class="description-header">
              <Briefcase20Regular :size="18" />
              <span>Краткое описание</span>
            </div>
            <p class="description-text">{{ user.shortDescription }}</p>
          </div>
          <div v-if="user.shortDescription && user.description" class="divider-minimal"></div>
          <div v-if="user.description" class="description-section">
            <div class="description-header">
              <DocumentText20Regular :size="18" />
              <span>Описание</span>
            </div>
            <p class="description-text">{{ user.description }}</p>
          </div>
        </div>
      </div>

      <!-- Специализации -->
      <SpecializationsManager />

      <!-- Дополнительная информация -->
      <div class="info-card">
        <h3 class="card-title">Дополнительная информация</h3>
        <div class="info-list">
          <div class="info-item">
            <div class="info-label">Дата регистрации</div>
            <div class="info-value">{{ formatDate(user.createdAt) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">Последнее обновление</div>
            <div class="info-value">{{ formatDate(user.updatedAt) }}</div>
          </div>
          <div class="info-item">
            <div class="info-label">ID пользователя</div>
            <div class="info-value info-value-code">{{ user.id }}</div>
          </div>
        </div>
      </div>

      <!-- Тестовая кнопка отправки в канал -->
      <div class="info-card">
        <h3 class="card-title">Тестирование</h3>
        <div class="test-section">
          <p class="test-description">Отправить тестовое сообщение в канал Telegram</p>
          <n-button
            type="primary"
            :loading="sendingMessage"
            :disabled="sendingMessage"
            @click="handleTestSend"
            block
            size="large"
            class="test-button"
          >
            Отправить тестовое сообщение
          </n-button>
        </div>
      </div>
    </div>

    <div v-else class="empty-state">
      <Person20Regular :size="64" class="empty-icon" />
      <p class="empty-text">Информация о пользователе не загружена</p>
    </div>
  </div>
</template>

<style scoped>
.profile-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  overflow-y: auto;
  padding: 1.5rem 1rem;
  padding-bottom: 5rem;
  background: #E5D7C4;
}

.profile-container {
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.profile-header-card {
  background: #4C3E19;
  padding: 2rem;
  border: 2px solid #354024;
  color: #FFFFFF;
  margin-bottom: 0.5rem;
}

.profile-header-content {
  display: flex;
  align-items: center;
  gap: 1.5rem;
}

.profile-avatar-wrapper {
  position: relative;
}

.profile-avatar {
  background: #E5D7C4;
  border: 2px solid #FFFFFF;
  font-weight: 700;
  font-size: 2rem;
  color: #1A1A1A;
}

.status-badge {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 2px solid #FFFFFF;
  background: #889063;
}

.status-active {
  background: #889063;
}

.profile-info {
  flex: 1;
}

.profile-name {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: #FFFFFF;
}

.profile-tags {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.info-card {
  background: #CFBB99;
  padding: 1.5rem;
  border: 2px solid #B5A082;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.info-card:hover {
  background: #C0AB88;
  border-color: #354024;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 1.25rem;
  padding-bottom: 0.75rem;
  border-bottom: 2px solid #B5A082;
}

.info-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4C3E19;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.info-value {
  font-size: 1rem;
  color: #1A1A1A;
  font-weight: 500;
}

.info-value-code {
  font-family: 'Monaco', 'Menlo', monospace;
  font-size: 0.875rem;
  background: #E5D7C4;
  padding: 0.375rem 0.75rem;
  border: 2px solid #B5A082;
  display: inline-block;
  color: #4C3E19;
}

.description-content {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.description-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.description-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #1A1A1A;
  font-size: 0.95rem;
}

.description-text {
  color: #4C3E19;
  line-height: 1.7;
  margin: 0;
  font-size: 0.95rem;
}

.divider-minimal {
  height: 2px;
  background: #B5A082;
  margin: 0.5rem 0;
}

.test-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.test-description {
  color: #4C3E19;
  font-size: 0.9rem;
  margin: 0;
}

.test-button {
  height: 44px;
  font-weight: 600;
  background: #354024;
  border: 2px solid #354024;
  color: #FFFFFF;
}

.test-button:hover {
  background: #4C3E19;
  border-color: #4C3E19;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 1rem;
}

.empty-icon {
  color: #889063;
  opacity: 0.7;
}

.empty-text {
  color: #4C3E19;
  font-size: 1rem;
}

:deep(.n-tag) {
  border: 2px solid #B5A082;
  font-weight: 500;
}

:deep(.n-button) {
  border: 2px solid;
}

:deep(.n-button--primary-type) {
  background: #354024;
  border-color: #354024;
  color: #FFFFFF;
}

:deep(.n-button--primary-type:hover) {
  background: #4C3E19;
  border-color: #4C3E19;
}
</style>
