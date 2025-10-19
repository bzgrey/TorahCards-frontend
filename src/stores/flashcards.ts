import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { FlashCardsAPI } from '../api/concepts/FlashCardsAPI.ts'
import type { FlashCards, Card, User } from '../api/types.ts'

export const useFlashcardsStore = defineStore('flashcards', () => {
  // State
  const allFlashcards = ref<FlashCards[]>([])
  const currentFlashcardSet = ref<FlashCards | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const flashcardCount = computed(() => allFlashcards.value.length)
  const currentCards = computed(() => currentFlashcardSet.value?.cards || [])
  const currentSetName = computed(() => currentFlashcardSet.value?.name || '')

  // Actions
  async function fetchUserFlashcards(user: string) {
    loading.value = true
    error.value = null
    
    try {
      const result = await FlashCardsAPI.getUserCards({ user })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      if (result.data) {
        allFlashcards.value = result.data
      }
      
      return true
    } catch (_err) {
      error.value = 'Failed to fetch flashcards'
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchFlashcardSet(user: string, name: string) {
    loading.value = true
    error.value = null
    
    try {
      const result = await FlashCardsAPI.getCards({ user, name })
      if (result.error) {
        error.value = result.error
        return false
      }

      
      if (result.data) {
        currentFlashcardSet.value = {
          name,
          cards: result.data.cards
        }
      }
      return true
    } catch (_err) {
      error.value = 'Failed to fetch flashcard set'
      return false
    } finally {
      loading.value = false
    }
  }

  async function addFlashcardSet(user: string, name: string, cards: Card[]) {
    loading.value = true
    error.value = null
    
    try {
      const result = await FlashCardsAPI.addFlashCards({ user, name, cards })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      // Refresh the flashcards list
      await fetchUserFlashcards(user)
      return true
    } catch (_err) {
      error.value = 'Failed to add flashcard set'
      return false
    } finally {
      loading.value = false
    }
  }

  async function removeFlashcardSet(user: string, name: string) {
    loading.value = true
    error.value = null
    
    try {
      const result = await FlashCardsAPI.removeFlashCards({ user, name })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      // Remove from local state
      allFlashcards.value = allFlashcards.value.filter((fc: FlashCards) => fc.name !== name)
      
      // Clear current set if it was deleted
      if (currentFlashcardSet.value?.name === name) {
        currentFlashcardSet.value = null
      }
      
      return true
    } catch (_err) {
      error.value = 'Failed to remove flashcard set'
      return false
    } finally {
      loading.value = false
    }
  }

  async function addCard(user: string, name: string, question: string, answer: string) {
    loading.value = true
    error.value = null
    
    try {
      const result = await FlashCardsAPI.addCard({ user, name, question, answer })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      // Add to current set if it's loaded
      if (currentFlashcardSet.value?.name === name) {
        currentFlashcardSet.value.cards.push({ question, answer })
      }
      
      return true
    } catch (_err) {
      error.value = 'Failed to add card'
      return false
    } finally {
      loading.value = false
    }
  }

  async function removeCard(user: string, name: string, card: Card) {
    loading.value = true
    error.value = null
    
    try {
      const result = await FlashCardsAPI.removeCard({ user, name, card })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      // Remove from current set if it's loaded
      if (currentFlashcardSet.value?.name === name) {
        currentFlashcardSet.value.cards = currentFlashcardSet.value.cards.filter(
          (c: Card) => c.question !== card.question || c.answer !== card.answer
        )
      }
      
      return true
    } catch (_err) {
      error.value = 'Failed to remove card'
      return false
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearCurrentSet() {
    currentFlashcardSet.value = null
  }

  return {
    // State
    allFlashcards,
    currentFlashcardSet,
    loading,
    error,
    
    // Getters
    flashcardCount,
    currentCards,
    currentSetName,
    
    // Actions
    fetchUserFlashcards,
    fetchFlashcardSet,
    addFlashcardSet,
    removeFlashcardSet,
    addCard,
    removeCard,
    clearError,
    clearCurrentSet
  }
})
