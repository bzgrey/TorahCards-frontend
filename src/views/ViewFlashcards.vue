<template>
  <div class="view-flashcards">
    <div v-if="loading" class="loading">Loading flashcards...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <!-- <div v-else-if="!cards || cards.length === 0" class="empty">
      <p>No flashcards found</p>
      <router-link to="/" class="btn btn-primary">Go Home</router-link>
    </div > -->
    
    <div v-else>
      <!-- View Mode Toggle -->
      <div class="view-controls">
        <h2 class="set-title">{{ setName }}</h2>
        <div class="view-mode-buttons">
          <button 
            @click="viewMode = 'slideshow'" 
            :class="['btn-view-mode', { active: viewMode === 'slideshow' }]"
          >
            Testing Mode
          </button>
          <button 
            @click="viewMode = 'edit'" 
            :class="['btn-view-mode', { active: viewMode === 'edit' }]"
          >
            View Mode
          </button>
        </div>
      </div>

      <!-- Slideshow Mode -->
      <div v-if="viewMode === 'slideshow'" class="slideshow-container">
        <div class="slideshow-card">
          <div class="card-counter">
            {{ currentCardIndex + 1 }} / {{ cards.length }}
          </div>
          
          <div class="flashcard" :class="{ flipped: isFlipped }" @click="toggleFlip">
            <div class="flashcard-inner">
              <div class="flashcard-front">
                <div class="card-label">Question</div>
                <div class="card-content">{{ cards[currentCardIndex].question }}</div>
                <div class="flip-hint">Click to see answer</div>
              </div>
              <div class="flashcard-back">
                <div class="card-label">Answer</div>
                <div class="card-content">{{ cards[currentCardIndex].answer }}</div>
                <div class="flip-hint">Click to see question</div>
              </div>
            </div>
          </div>

          <div class="navigation-buttons">
            <button 
              @click="previousCard" 
              :disabled="currentCardIndex === 0"
              class="btn-nav btn-prev"
            >
              ← Previous
            </button>
            <button 
              @click="nextCard" 
              :disabled="currentCardIndex === cards.length - 1"
              class="btn-nav btn-next"
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <!-- General View Mode -->
      <FlashCardSet
        v-else
        :set-name="setName"
        :initial-cards="cards"
        :read-only="isReadOnly"
        @save="handleSave"
        @delete="handleDelete"
        @update-set-name="handleUpdateSetName"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FlashCardSet from '../components/FlashCardSet.vue'
import { FlashCardsAPI } from '../api/concepts/FlashCardsAPI'
import { useUserStore } from '../stores/user'
import type { Card } from '../api/types.ts'

const route = useRoute()
const router = useRouter()
const userStore = useUserStore()

// State
const loading = ref(false)
const error = ref<string | null>(null)
const setName = ref('')
const cards = ref<Card[]>([])
const viewMode = ref<'slideshow' | 'edit'>('edit')
const currentCardIndex = ref(0)
const isFlipped = ref(false)

// Get user - use mock user if not authenticated
const username = computed(() => userStore.username || 'testUser')

// Get the owner from query params if viewing another user's flashcards
const setOwner = computed(() => (route.query.user as string) ?? userStore.userId)
const isReadOnly = computed(() => setOwner.value !== userStore.userId)

// Slideshow navigation
const nextCard = () => {
  if (currentCardIndex.value < cards.value.length - 1) {
    currentCardIndex.value++
    isFlipped.value = false
  }
}

const previousCard = () => {
  if (currentCardIndex.value > 0) {
    currentCardIndex.value--
    isFlipped.value = false
  }
}

const toggleFlip = () => {
  isFlipped.value = !isFlipped.value
}

// Keyboard navigation
const handleKeyPress = (event: KeyboardEvent) => {
  if (viewMode.value !== 'slideshow') return
  
  if (event.key === 'ArrowRight') {
    nextCard()
  } else if (event.key === 'ArrowLeft') {
    previousCard()
  } else if (event.key === ' ') {
    event.preventDefault()
    toggleFlip()
  }
}

onMounted(() => {
  loadFlashcards()
  window.addEventListener('keydown', handleKeyPress)
})

// Cleanup
import { onUnmounted } from 'vue'
onUnmounted(() => {
  window.removeEventListener('keydown', handleKeyPress)
})

const handleSave = async (name: string, updatedCards: Card[]) => {
  if (!userStore.userId) return
  
  try {
    loading.value = true
    error.value = null
    
    // Remove the old set
    const removeResult = await FlashCardsAPI.removeFlashCards({
      user: userStore.userId,
      name: setName.value
    })
    
    if (removeResult.error) {
      alert(`Error saving: ${removeResult.error}`)
      return
    }
    
    // Add the updated set
    const addResult = await FlashCardsAPI.addFlashCards({
      user: userStore.userId,
      name,
      cards: updatedCards
    })
    
    if (addResult.error) {
      alert(`Error saving: ${addResult.error}`)
    } else {
      // Reload the updated set
      await loadFlashcards(name)
    }
  } catch (err) {
    alert('Failed to save changes')
  } finally {
    loading.value = false
  }
}

const handleDelete = async () => {
  if (!userStore.userId) return
  
  try {
    loading.value = true
    const result = await FlashCardsAPI.removeFlashCards({
      user: userStore.userId,
      name: setName.value
    })
    
    if (result.error) {
      alert(`Error: ${result.error}`)
    } else {
      router.push('/')
    }
  } catch (err) {
    alert('Failed to delete set')
  } finally {
    loading.value = false
  }
}

const handleUpdateSetName = async (newName: string) => {
  // Update local state
  setName.value = newName
  console.log('Set name updated to:', newName)
}

const loadFlashcards = async (nameParam?: string) => {
  if (!userStore.userId) return
  
  // Clear any previous errors
  error.value = null
  
  // Get the set name from route params or use the provided one
  const setNameParam = nameParam || (route.params.id as string) || 'Flashcard Set'

  loading.value = true
  // Fetch cards from API
  const result = await FlashCardsAPI.getCards({
    user: setOwner.value,
    name: setNameParam
  })
  
  if (result.error) {
    error.value = result.error
  } else if (result.data) {
    setName.value = setNameParam
    cards.value = result.data.cards || []
  }
  
  loading.value = false
}

onMounted(() => {
  loadFlashcards()
})
</script>

<style scoped>
.view-flashcards {
  min-height: calc(100vh - 100px);
  padding: 20px;
}

.loading,
.error,
.empty {
  text-align: center;
  padding: 60px 20px;
  font-size: 18px;
}

.error {
  color: #dc3545;
}

.empty p {
  margin-bottom: 20px;
}

.btn-primary {
  background: #007bff;
  color: white;
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  text-decoration: none;
  display: inline-block;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-primary:hover {
  opacity: 0.8;
}

/* View Controls */
.view-controls {
  max-width: 1200px;
  margin: 0 auto 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 20px;
}

.set-title {
  color: #007bff;
  margin: 0;
  font-size: 2rem;
}

.view-mode-buttons {
  display: flex;
  gap: 10px;
}

.btn-view-mode {
  padding: 10px 20px;
  border: 2px solid #007bff;
  background: white;
  color: #007bff;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn-view-mode:hover {
  background: #e7f3ff;
}

.btn-view-mode.active {
  background: #007bff;
  color: white;
}

/* Slideshow Container */
.slideshow-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 40px 20px;
}

.slideshow-card {
  position: relative;
}

.card-counter {
  text-align: center;
  font-size: 18px;
  color: #6c757d;
  margin-bottom: 20px;
  font-weight: 600;
}

/* Flashcard with Flip Animation */
.flashcard {
  width: 100%;
  height: 500px;
  perspective: 1000px;
  cursor: pointer;
  margin-bottom: 30px;
}

.flashcard-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flashcard.flipped .flashcard-inner {
  transform: rotateY(180deg);
}

.flashcard-front,
.flashcard-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 40px;
  border-radius: 16px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
}

.flashcard-front {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.flashcard-back {
  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
  color: white;
  transform: rotateY(180deg);
}

.card-label {
  position: absolute;
  top: 20px;
  left: 30px;
  font-size: 14px;
  font-weight: 600;
  text-transform: uppercase;
  opacity: 0.8;
  letter-spacing: 1px;
}

.card-content {
  font-size: 28px;
  line-height: 1.6;
  text-align: center;
  font-weight: 500;
  max-width: 100%;
  overflow-y: auto;
  max-height: 350px;
}

.flip-hint {
  position: absolute;
  bottom: 20px;
  font-size: 14px;
  opacity: 0.7;
  font-style: italic;
}

/* Navigation Buttons */
.navigation-buttons {
  display: flex;
  justify-content: center;
  gap: 20px;
}

.btn-nav {
  padding: 15px 40px;
  font-size: 18px;
  font-weight: 600;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background: #007bff;
  color: white;
}

.btn-nav:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 123, 255, 0.3);
}

.btn-nav:disabled {
  background: #6c757d;
  cursor: not-allowed;
  opacity: 0.5;
}

.btn-prev {
  background: #6c757d;
}

.btn-prev:hover:not(:disabled) {
  background: #5a6268;
}

@media (max-width: 768px) {
  .view-controls {
    flex-direction: column;
    text-align: center;
  }

  .set-title {
    font-size: 1.5rem;
  }

  .flashcard {
    height: 400px;
  }

  .card-content {
    font-size: 22px;
  }

  .navigation-buttons {
    flex-direction: column;
  }

  .btn-nav {
    width: 100%;
  }
}
</style>
