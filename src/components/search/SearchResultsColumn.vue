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
  background: white;
  border-radius: 8px;
  padding: 20px;
  min-height: 400px;
  border: 2px solid var(--border-gold, #CBBF7A);
}

.column-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  padding-bottom: 16px;
  border-bottom: 3px solid var(--border-gold, #CBBF7A);
}

.column-header h2 {
  font-family: var(--font-heading, 'EB Garamond', serif);
  margin: 0;
  color: var(--accent-leather, #A67C52);
  font-size: 1.6rem;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.result-count {
  font-family: var(--font-ui, 'Noto Sans', sans-serif);
  background: var(--accent-leather, #A67C52);
  color: white;
  padding: 6px 14px;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: var(--text-body, #2F2F2F);
  opacity: 0.6;
}

.empty-state p {
  font-family: var(--font-body, 'Noto Sans', sans-serif);
  font-size: 1.1rem;
  margin: 0;
  line-height: 1.6;
}

.results-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
