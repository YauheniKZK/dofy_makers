<script setup lang="ts">
</script>

<template>
  <div class="catalog-page">
    <div class="catalog-header">
      <h1 class="page-title">Мой каталог</h1>
      <p class="page-subtitle">Управляйте своими материалами и ресурсами</p>
    </div>
    
    <div class="catalog-content">
      <div class="empty-catalog">
        <div class="empty-icon">📚</div>
        <h3 class="empty-title">Каталог пуст</h3>
        <p class="empty-description">Здесь будут отображаться ваши материалы и ресурсы</p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.catalog-page {
  display: flex;
  flex-direction: column;
  min-height: 100%;
  padding: 1.5rem 1rem;
  padding-bottom: 5rem;
  background: #E5D7C4;
}

.catalog-header {
  max-width: 680px;
  width: 100%;
  margin: 0 auto 2rem;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: #1A1A1A;
  margin-bottom: 0.5rem;
}

.page-subtitle {
  font-size: 1rem;
  color: #4C3E19;
  margin: 0;
}

.catalog-content {
  max-width: 680px;
  width: 100%;
  margin: 0 auto;
}

.empty-catalog {
  background: #CFBB99;
  padding: 4rem 2rem;
  text-align: center;
  border: 2px solid #B5A082;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  opacity: 0.7;
}

.empty-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1A1A1A;
  margin-bottom: 0.5rem;
}

.empty-description {
  color: #4C3E19;
  font-size: 0.95rem;
  margin: 0;
}
</style>
