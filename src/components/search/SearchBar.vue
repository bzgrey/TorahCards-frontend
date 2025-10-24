<template>
  <div class="search-bar">
    <input
      v-model="searchTerm"
      type="text"
      placeholder="Enter search term..."
      class="search-input"
      @keyup.enter="handleSearch"
    />
    <button 
      @click="handleSearch" 
      class="btn btn-search" 
      :disabled="!searchTerm.trim() || isSearching"
    >
      {{ isSearching ? 'Searching...' : 'Search' }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Props {
  isSearching?: boolean
}

interface Emits {
  (e: 'search', searchTerm: string): void
}

withDefaults(defineProps<Props>(), {
  isSearching: false
})

const emit = defineEmits<Emits>()

const searchTerm = ref('')

const handleSearch = () => {
  const term = searchTerm.value.trim()
  if (term) {
    emit('search', term)
  }
}
</script>

<style scoped>
.search-bar {
  display: flex;
  gap: 12px;
  margin-bottom: 24px;
}

.search-input {
  flex: 1;
  padding: 16px 20px;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  font-size: 18px;
  transition: border-color 0.2s;
}

.search-input:focus {
  outline: none;
  border-color: #007bff;
}

.btn {
  padding: 16px 32px;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-size: 18px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  opacity: 0.85;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-search {
  background: #007bff;
  color: white;
  min-width: 150px;
}

@media (max-width: 768px) {
  .search-bar {
    flex-direction: column;
  }

  .btn-search {
    width: 100%;
  }
}
</style>
