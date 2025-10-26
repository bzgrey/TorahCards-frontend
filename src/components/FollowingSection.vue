<template>
  <section class="content-section following-section">
    <h2 class="section-title">Following</h2>
    
    <div v-if="loading" class="loading-state">Loading followed items...</div>
    <div v-else-if="error" class="error-state">{{ error }}</div>
    <div v-else class="content-grid">
      <!-- Followed Notes -->
      <div class="content-card">
        <div class="card-header">
          <h3>📄 Followed Notes</h3>
          <span class="badge">{{ followedNotes.length }}</span>
        </div>
        
        <div v-if="followedNotes.length === 0" class="empty-state">
          <p>No followed notes yet</p>
          <p class="hint-text">Search for notes and click the Follow button to see them here</p>
        </div>
        <div v-else class="items-list">
          <div 
            v-for="note in followedNotes" 
            :key="note.id" 
            class="item followed-item"
          >
            <div class="item-content" @click="$emit('view-note', note)">
              <div class="item-name">{{ note.name }}</div>
              <div class="item-owner">by {{ note.user }}</div>
              <div class="item-preview">{{ getPreview(note.content) }}</div>
            </div>
            <button 
              class="btn-unfollow" 
              @click.stop="$emit('unfollow-note', note.id)"
              title="Unfollow this note"
            >
              ✕
            </button>
          </div>
        </div>
      </div>

      <!-- Followed Flashcards -->
      <div class="content-card">
        <div class="card-header">
          <h3>🎴 Followed Flashcards</h3>
          <span class="badge">{{ followedFlashcards.length }}</span>
        </div>
        
        <div v-if="followedFlashcards.length === 0" class="empty-state">
          <p>No followed flashcard sets yet</p>
          <p class="hint-text">Search for flashcards and click the Follow button to see them here</p>
        </div>
        <div v-else class="items-list">
          <div 
            v-for="flashcard in followedFlashcards" 
            :key="flashcard.id" 
            class="item followed-item"
          >
            <div class="item-content" @click="$emit('view-flashcard', flashcard)">
              <div class="item-name">{{ flashcard.name }}</div>
              <div class="item-owner">by {{ flashcard.user }}</div>
              <div class="item-count">{{ flashcard.cards?.length || 0 }} cards</div>
            </div>
            <button 
              class="btn-unfollow" 
              @click.stop="$emit('unfollow-flashcard', flashcard.id)"
              title="Unfollow this flashcard set"
            >
              ✕
            </button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import type { GetNotesInfoResponse, GetFlashcardInfoResponse } from '../api/types'

interface Props {
  followedNotes: GetNotesInfoResponse[]
  followedFlashcards: GetFlashcardInfoResponse[]
  loading?: boolean
  error?: string | null
}

interface Emits {
  (e: 'view-note', note: GetNotesInfoResponse): void
  (e: 'view-flashcard', flashcard: GetFlashcardInfoResponse): void
  (e: 'unfollow-note', noteId: string): void
  (e: 'unfollow-flashcard', flashcardId: string): void
}

defineProps<Props>()
defineEmits<Emits>()

const getPreview = (content: string) => {
  if (!content) return 'Empty note'
  return content.length > 80 ? content.substring(0, 80) + '...' : content
}
</script>

<style scoped>
.content-section {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.section-title {
  margin: 0 0 24px 0;
  color: #333;
  font-size: 1.8rem;
  border-bottom: 3px solid #007bff;
  padding-bottom: 10px;
}

.content-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 24px;
}

.content-card {
  background: #f8f9fa;
  border: 2px solid #e9ecef;
  border-radius: 8px;
  padding: 20px;
  transition: transform 0.2s, box-shadow 0.2s;
}

.content-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.card-header h3 {
  margin: 0;
  color: #007bff;
  font-size: 1.4rem;
}

.badge {
  background: #007bff;
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}

.loading-state,
.error-state,
.empty-state {
  text-align: center;
  padding: 40px 20px;
}

.error-state {
  color: #dc3545;
}

.items-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.item {
  background: white;
  border: 1px solid #dee2e6;
  border-radius: 6px;
  padding: 16px;
  cursor: pointer;
  transition: all 0.2s;
}

.item:hover {
  border-color: #007bff;
  box-shadow: 0 2px 8px rgba(0, 123, 255, 0.2);
  transform: translateX(4px);
}

.item-name {
  font-weight: 600;
  color: #333;
  margin-bottom: 6px;
  font-size: 1.1rem;
}

.item-preview {
  color: #6c757d;
  font-size: 0.9rem;
  line-height: 1.4;
}

.item-count {
  color: #28a745;
  font-size: 0.9rem;
  font-weight: 600;
}

.followed-item {
  display: flex;
  align-items: stretch;
  padding: 12px;
  gap: 12px;
}

.item-content {
  flex: 1;
  cursor: pointer;
}

.item-owner {
  color: #6c757d;
  font-size: 0.85rem;
  font-style: italic;
  margin-bottom: 6px;
}

.btn-unfollow {
  background: #dc3545;
  color: white;
  border: none;
  border-radius: 50%;
  width: 32px;
  height: 32px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
  align-self: center;
}

.btn-unfollow:hover {
  background: #c82333;
  transform: scale(1.1);
}

.hint-text {
  color: #adb5bd;
  font-size: 0.9rem;
  margin-top: 8px;
}

.following-section {
  background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
}
</style>
