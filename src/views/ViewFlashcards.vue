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

// Get user - use mock user if not authenticated
const username = computed(() => userStore.username || 'testUser')

// Get the owner from query params if viewing another user's flashcards
const setOwner = computed(() => (route.query.user as string) ?? userStore.userId)
const isReadOnly = computed(() => setOwner.value !== userStore.userId)

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
