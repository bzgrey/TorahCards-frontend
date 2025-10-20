<template>
  <div class="view-flashcards">
    <div v-if="loading" class="loading">Loading flashcards...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <!-- <div v-else-if="!cards || cards.length === 0" class="empty">
      <p>No flashcards found</p>
      <router-link to="/" class="btn btn-primary">Go Home</router-link>
    </div> -->
    
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
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import FlashCardSet from '../components/FlashCardSet.vue'
import { useFlashcardsStore } from '../stores/flashcards'
import { useUserStore } from '../stores/user'
import type { Card } from '../api/types.ts'

const route = useRoute()
const router = useRouter()
const flashcardsStore = useFlashcardsStore()
const userStore = useUserStore()

// Use store state
const loading = computed(() => flashcardsStore.loading)
const error = computed(() => flashcardsStore.error)
const setName = computed(() => flashcardsStore.currentSetName)
const cards = computed(() => flashcardsStore.currentCards)

// Get user - use mock user if not authenticated
const username = computed(() => userStore.currentUser?.username || 'testUser')

// Get the owner from query params if viewing another user's flashcards
const setOwner = computed(() => (route.query.user as string) || username.value)
const isReadOnly = computed(() => setOwner.value !== username.value)

const handleSave = async (name: string, updatedCards: Card[]) => {
  try {
    // TODO: Implement proper update API endpoint
    // For now, we'll remove and re-add the flashcard set
    // First remove the old set
    const removeSuccess = await flashcardsStore.removeFlashcardSet(
      username.value, 
      setName.value
    )
    
    if (!removeSuccess) {
      alert(`Error saving: ${flashcardsStore.error}`)
      return
    }
    
    // Then add the updated set
    const addSuccess = await flashcardsStore.addFlashcardSet(
      username.value,
      name,
      updatedCards
    )
    
    if (!addSuccess) {
      alert(`Error saving: ${flashcardsStore.error}`)
    } else {
      // Reload the updated set
      await flashcardsStore.fetchFlashcardSet(username.value, name)
    }
  } catch (err) {
    alert('Failed to save changes')
  }
}

const handleDelete = async () => {
  try {
    const success = await flashcardsStore.removeFlashcardSet(
      username.value, 
      setName.value
    )
    
    if (!success) {
      alert(`Error: ${flashcardsStore.error}`)
    } else {
      router.push('/')
    }
  } catch (err) {
    alert('Failed to delete set')
  }
}

const handleUpdateSetName = async (newName: string) => {
  // TODO: Implement API call to update set name on backend
  console.log('Set name updated to:', newName)
  // For now, we could update the current set in the store
  if (flashcardsStore.currentFlashcardSet) {
    flashcardsStore.currentFlashcardSet.name = newName
  }
}

const loadFlashcards = async () => {
  // Clear any previous errors
  flashcardsStore.clearError()
  
  // Get the set name from route params
  const setNameParam = route.params.id as string || 'Flashcard Set'

  // Fetch cards from store using the set owner (could be current user or another user)
  await flashcardsStore.fetchFlashcardSet(setOwner.value, setNameParam)  
}

onMounted(() => {
  loadFlashcards()
})
</script>

<style scoped>
.view-flashcards {
  min-height: calc(100vh - 100px);
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
</style>
