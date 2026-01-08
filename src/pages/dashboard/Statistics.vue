<script setup lang="ts">
</script>

<template>
  <div class="statistics-page">
    <div class="statistics-header">
      <h1 class="page-title">Статистика</h1>
      <p class="page-subtitle">Аналитика и показатели вашей активности</p>
    </div>
    
    <div class="statistics-content">
      <div class="stats-cards">
        <div class="stat-card-large">
          <div class="stat-card-header">
            <div class="stat-card-icon stat-icon-blue">📊</div>
            <div class="stat-card-info">
              <div class="stat-card-label">Общая активность</div>
              <div class="stat-card-value">—</div>
            </div>
          </div>
        </div>
        
        <div class="stat-card-large">
          <div class="stat-card-header">
            <div class="stat-card-icon stat-icon-green">✅</div>
            <div class="stat-card-info">
              <div class="stat-card-label">Выполнено задач</div>
              <div class="stat-card-value">—</div>
            </div>
          </div>
        </div>
      </div>

      <div class="empty-statistics">
        <div class="empty-icon">📈</div>
        <h3 class="empty-title">Статистика пока недоступна</h3>
        <p class="empty-description">Данные будут отображаться по мере накопления активности</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.statistics-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 1.5rem 1rem;
  padding-bottom: 5rem;
  background: #f8fafc;
}

.statistics-header {
  max-width: 680px;
  width: 100%;
  margin: 0 auto 2rem;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin: 0;
}

.statistics-content {
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.stats-cards {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.stat-card-large {
  background: white;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
}

.stat-card-header {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-card-icon {
  width: 56px;
  height: 56px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.75rem;
}

.stat-icon-blue {
  background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%);
}

.stat-icon-green {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

.stat-card-info {
  flex: 1;
}

.stat-card-label {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 0.25rem;
}

.stat-card-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #0f172a;
}

.empty-statistics {
  background: white;
  border-radius: 20px;
  padding: 4rem 2rem;
  text-align: center;
  box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1);
  border: 1px solid #e2e8f0;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.6;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #0f172a;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #64748b;
  font-size: 0.95rem;
  margin: 0;
}
</style>
