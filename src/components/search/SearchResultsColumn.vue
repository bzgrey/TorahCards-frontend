<template>
  <div class="results-column">
    <div class="column-header">
      <h2>{{ icon }} {{ title }}</h2>
      <span class="result-count">{{ resultCount }}</span>
    </div>
    
    <div v-if="resultCount === 0" class="empty-state">
      <p>No {{ emptyMessage }} matching "{{ searchTerm }}"</p>
    </div>
    
    <div v-else class="results-list">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  title: string
  icon: string
  resultCount: number
  searchTerm: string
  emptyMessage: string
}

defineProps<Props>()
</script>

<style scoped>
.results-column {
  background: #f8f9fa;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 3px solid #007bff;
}

.column-header h2 {
  margin: 0;
  color: #007bff;
  font-size: 1.6rem;
}

.result-count {
  background: #007bff;
  color: white;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.empty-state p {
  font-size: 1.1rem;
  margin: 0;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
