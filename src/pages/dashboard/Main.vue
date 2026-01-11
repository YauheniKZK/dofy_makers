<script setup lang="ts">
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '@/stores/user'
import { storeToRefs } from 'pinia'
import { NCard, NAlert } from 'naive-ui'

const router = useRouter()
const userStore = useUserStore()
const { currentUserGetters, isBlocked, blockReasons } = storeToRefs(userStore)

const blockMessage = computed(() => {
  if (!blockReasons.value || blockReasons.value.length === 0) {
    return ''
  }
  const reasons = blockReasons.value
    .map(reason => `• ${reason.description || reason.name}`)
    .join('\n')
  return `Ваш аккаунт заблокирован.\n\nПричины блокировки:\n${reasons}`
})

onMounted(() => {
  // Если пользователь заблокирован, перенаправляем на стартовую страницу
  if (isBlocked.value) {
    router.push('/')
  }
})
</script>

<template>
  <div class="dashboard-page">
    <div v-if="isBlocked" class="error-container">
      <n-alert type="error" title="Аккаунт заблокирован" class="error-alert">
        <pre class="whitespace-pre-wrap">{{ blockMessage }}</pre>
      </n-alert>
    </div>
    <div v-else class="dashboard-content">
      <div class="welcome-section">
        <h1 class="welcome-title">Добро пожаловать!</h1>
        <p class="welcome-subtitle">Управляйте своими специализациями и профилем</p>
      </div>
      
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon stat-icon-primary">📊</div>
          <div class="stat-content">
            <div class="stat-label">Статистика</div>
            <div class="stat-value">Просмотр</div>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon stat-icon-success">📁</div>
          <div class="stat-content">
            <div class="stat-label">Каталог</div>
            <div class="stat-value">Управление</div>
          </div>
        </div>
      </div>

      <div class="quick-actions">
        <h2 class="section-title">Быстрые действия</h2>
        <div class="actions-grid">
          <button class="action-card" @click="router.push('/dashboard/profile')">
            <div class="action-icon">👤</div>
            <div class="action-text">Профиль</div>
          </button>
          <button class="action-card" @click="router.push('/dashboard/catalog')">
            <div class="action-icon">📚</div>
            <div class="action-text">Каталог</div>
          </button>
          <button class="action-card" @click="router.push('/dashboard/statistics')">
            <div class="action-icon">📈</div>
            <div class="action-text">Статистика</div>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 1.5rem 1rem;
  padding-bottom: 5rem;
  background: #E5D7C4;
}

.error-container {
  max-width: 500px;
  width: 100%;
  margin: 2rem auto;
}

.error-alert {
  border: 2px solid #B5A082;
  background: #CFBB99;
}

.dashboard-content {
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.welcome-section {
  text-align: center;
  padding: 2rem 1rem;
  background: #4C3E19;
  border: 2px solid #354024;
  color: #FFFFFF;
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: #FFFFFF;
}

.welcome-subtitle {
  font-size: 1rem;
  color: #E5D7C4;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: #CFBB99;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  border: 2px solid #B5A082;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.stat-card:hover {
  background: #C0AB88;
  border-color: #354024;
}

.stat-icon {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
  border: 2px solid #354024;
}

.stat-icon-primary {
  background: #354024;
}

.stat-icon-success {
  background: #889063;
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #4C3E19;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #1A1A1A;
}

.quick-actions {
  background: #CFBB99;
  padding: 1.5rem;
  border: 2px solid #B5A082;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.action-card {
  background: #E5D7C4;
  border: 2px solid #B5A082;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: background-color 0.2s ease, border-color 0.2s ease;
}

.action-card:hover {
  background: #CFBB99;
  border-color: #354024;
}

.action-icon {
  font-size: 2rem;
}

.action-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #4C3E19;
}
</style>
