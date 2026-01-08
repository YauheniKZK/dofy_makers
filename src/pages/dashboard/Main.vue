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
  background: #f8fafc;
}

.error-container {
  max-width: 500px;
  width: 100%;
  margin: 2rem auto;
}

.error-alert {
  border-radius: 16px;
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
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border-radius: 20px;
  color: white;
  box-shadow: 0 10px 25px -5px rgb(102 126 234 / 0.3);
}

.welcome-title {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
  color: white;
}

.welcome-subtitle {
  font-size: 1rem;
  opacity: 0.9;
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 1rem;
}

.stat-card {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
  transition: all 0.2s ease;
}

.stat-card:hover {
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  transform: translateY(-2px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.5rem;
}

.stat-icon-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon-success {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-content {
  flex: 1;
}

.stat-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-value {
  font-size: 1rem;
  font-weight: 600;
  color: #0f172a;
}

.quick-actions {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 1rem;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

.action-card {
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-card:hover {
  background: #f1f5f9;
  border-color: #cbd5e1;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
}

.action-icon {
  font-size: 2rem;
}

.action-text {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}
</style>
