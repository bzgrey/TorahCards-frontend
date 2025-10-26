<template>
  <div class="result-card">
    <div class="card-content" @click="handleClick">
      <div class="result-header">
        <h3 class="result-name">{{ flashcardSet.name }}</h3>
        <span class="card-count">{{ flashcardSet.cards.length }} cards</span>
      </div>
      <div class="result-owner">by {{ flashcardSet.setOwner }}</div>
      <div class="result-preview">
        {{ flashcardSet.cards.length > 0 ? getCardsPreview(flashcardSet.cards) : 'Empty set' }}
      </div>
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
import type { SearchFlashcardsResult, Card } from '../../api/types'

interface Props {
  flashcardSet: SearchFlashcardsResult['flashcardSet']
  isFollowing: boolean
}

interface Emits {
  (e: 'click', flashcardSet: SearchFlashcardsResult['flashcardSet']): void
  (e: 'follow', flashcardId: string): void
  (e: 'unfollow', flashcardId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isLoading = ref(false)

const getCardsPreview = (cards: Card[]) => {
  if (cards.length === 0) return 'No cards'
  const firstCard = cards[0]
  const preview = `${firstCard.question}: ${firstCard.answer}`
  return preview.length > 100 ? preview.substring(0, 100) + '...' : preview
}

const handleClick = () => {
  emit('click', props.flashcardSet)
}

const handleFollowToggle = async () => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    if (props.isFollowing) {
      emit('unfollow', props.flashcardSet.id)
    } else {
      emit('follow', props.flashcardSet.id)
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

.card-count {
  background: #17a2b8;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
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
