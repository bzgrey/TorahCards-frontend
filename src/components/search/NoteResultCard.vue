<template>
  <div class="result-card" @click="handleClick">
    <div class="result-header">
      <h3 class="result-name">{{ note.name }}</h3>
    </div>
    <div class="result-owner">by {{ note.notesOwner }}</div>
    <div class="result-preview">{{ getPreview(note.content) }}</div>
  </div>
</template>

<script setup lang="ts">
import type { SearchNotesResult } from '../../api/types'

interface Props {
  note: SearchNotesResult['note']
}

interface Emits {
  (e: 'click', note: SearchNotesResult['note']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getPreview = (content: string) => {
  if (!content) return 'Empty content'
  return content.length > 150 ? content.substring(0, 150) + '...' : content
}

const handleClick = () => {
  emit('click', props.note)
}
</script>

<style scoped>
.result-card {
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  cursor: pointer;
  transition: all 0.2s;
}

.result-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  transform: translateY(-2px);
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.result-name {
  margin: 0;
  color: #333;
  font-size: 1.3rem;
  flex: 1;
}

.result-owner {
  color: #6c757d;
  font-size: 0.95rem;
  margin-bottom: 12px;
  font-style: italic;
}

.result-preview {
  color: #495057;
  line-height: 1.5;
  font-size: 1rem;
}
</style>
