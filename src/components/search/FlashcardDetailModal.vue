<template>
  <div v-if="flashcardSet" class="modal-overlay" @click.self="handleClose">
    <div class="modal modal-large">
      <button @click="handleClose" class="btn-close">✕</button>
      <div class="modal-header">
        <h2>{{ flashcardSet.name }}</h2>
        <div class="modal-meta">
          by {{ flashcardSet.setOwner }} · {{ flashcardSet.cards.length }} cards
        </div>
      </div>
      <div class="modal-content">
        <div v-if="flashcardSet.cards.length === 0" class="empty-state">
          This flashcard set is empty
        </div>
        <div v-else class="flashcards-list">
          <div v-for="(card, index) in flashcardSet.cards" :key="index" class="flashcard">
            <div class="flashcard-number">Card {{ index + 1 }}</div>
            <div class="flashcard-question">
              <strong>Q:</strong> {{ card.question }}
            </div>
            <div class="flashcard-answer">
              <strong>A:</strong> {{ card.answer }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SearchFlashcardsResult } from '../../api/types'

interface Props {
  flashcardSet: SearchFlashcardsResult['flashcardSet'] | null
}

interface Emits {
  (e: 'close'): void
}

defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClose = () => {
  emit('close')
}
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1100;
  padding: 20px;
}

.modal {
  background: white;
  border-radius: 12px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal-large {
  max-width: 900px;
}

.btn-close {
  position: absolute;
  top: 20px;
  right: 20px;
  background: #dc3545;
  color: white;
  border: none;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 20px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
  z-index: 10;
}

.btn-close:hover {
  opacity: 0.8;
}

.modal-header {
  padding: 30px;
  border-bottom: 2px solid #e9ecef;
}

.modal-header h2 {
  margin: 0 0 8px 0;
  color: #007bff;
  font-size: 2rem;
  padding-right: 50px;
}

.modal-meta {
  color: #6c757d;
  font-size: 1rem;
  font-style: italic;
}

.modal-content {
  padding: 30px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: #6c757d;
}

.flashcards-list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.flashcard {
  background: #f8f9fa;
  border: 2px solid #dee2e6;
  border-radius: 8px;
  padding: 20px;
}

.flashcard-number {
  color: #007bff;
  font-weight: 600;
  font-size: 0.9rem;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.flashcard-question {
  margin-bottom: 16px;
  padding: 16px;
  background: white;
  border-left: 4px solid #007bff;
  border-radius: 4px;
  font-size: 1.05rem;
}

.flashcard-answer {
  padding: 16px;
  background: white;
  border-left: 4px solid #28a745;
  border-radius: 4px;
  font-size: 1.05rem;
}

.flashcard-question strong,
.flashcard-answer strong {
  color: #495057;
  margin-right: 8px;
}

@media (max-width: 768px) {
  .modal {
    max-width: 100%;
    max-height: 100vh;
    border-radius: 0;
  }

  .modal-header h2 {
    font-size: 1.5rem;
  }

  .modal-content {
    padding: 20px;
  }
}
</style>
