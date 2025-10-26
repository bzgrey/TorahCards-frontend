<template>
  <div class="result-card">
    <div class="card-content" @click="handleClick">
      <div class="result-header">
        <h3 class="result-name">{{ note.name }}</h3>
      </div>
      <div class="result-owner">by {{ note.notesOwner }}</div>
      <div class="result-preview">{{ getPreview(note.content) }}</div>
    </div>
    <div class="card-actions">
      <FollowButton 
        :is-following="isFollowing"
        :is-loading="isLoading"
        @toggle="handleFollowToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FollowButton from '../FollowButton.vue'
import type { SearchNotesResult } from '../../api/types'

interface Props {
  note: SearchNotesResult['note']
  isFollowing: boolean
}

interface Emits {
  (e: 'click', note: SearchNotesResult['note']): void
  (e: 'follow', noteId: string): void
  (e: 'unfollow', noteId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isLoading = ref(false)

const getPreview = (content: string) => {
  if (!content) return 'Empty content'
  return content.length > 150 ? content.substring(0, 150) + '...' : content
}

const handleClick = () => {
  emit('click', props.note)
}

const handleFollowToggle = async () => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    if (props.isFollowing) {
      emit('unfollow', props.note.id)
    } else {
      emit('follow', props.note.id)
    }
  } finally {
    // Keep loading state until parent updates
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}
</script>

<style scoped>
.result-card {
  background: white;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-card:hover {
  border-color: #007bff;
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.2);
  transform: translateY(-2px);
}

.card-content {
  cursor: pointer;
  flex: 1;
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

.card-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid #e9ecef;
}
</style>
