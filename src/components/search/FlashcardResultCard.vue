<template>
  <div class="result-card" @click="handleClick">
    <div class="result-header">
      <h3 class="result-name">{{ flashcardSet.name }}</h3>
      <span class="card-count">{{ flashcardSet.cards.length }} cards</span>
    </div>
    <div class="result-owner">by {{ flashcardSet.setOwner }}</div>
    <div class="result-preview">
      {{ flashcardSet.cards.length > 0 ? getCardsPreview(flashcardSet.cards) : 'Empty set' }}
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchFlashcardsResult, Card } from '../../api/types'

interface Props {
  flashcardSet: SearchFlashcardsResult['flashcardSet']
}

interface Emits {
  (e: 'click', flashcardSet: SearchFlashcardsResult['flashcardSet']): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const getCardsPreview = (cards: Card[]) => {
  if (cards.length === 0) return 'No cards'
  const firstCard = cards[0]
  const preview = `${firstCard.question}: ${firstCard.answer}`
  return preview.length > 100 ? preview.substring(0, 100) + '...' : preview
}

const handleClick = () => {
  emit('click', props.flashcardSet)
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
</style>
