<template>
  <div class="view-search">
    <div class="header">
      <h1>🔍 Search</h1>
      <p class="subtitle">Search across all notes and flashcards</p>
    </div>

    <div class="search-container">
      <SearchBar 
        :is-searching="isSearching" 
        @search="handleSearch" 
      />

      <div v-if="hasSearched && !isSearching" class="results-summary">
        Found {{ notesResults.length }} note(s) and {{ flashcardsResults.length }} flashcard set(s)
      </div>

      <div v-if="searchError" class="error-message">
        {{ searchError }}
      </div>

      <div v-if="hasSearched && !isSearching" class="results-grid">
        <!-- Notes Column -->
        <SearchResultsColumn
          title="Notes"
          icon="📝"
          :result-count="notesResults.length"
          :search-term="lastSearchTerm"
          empty-message="notes found"
        >
          <NoteResultCard
            v-for="result in notesResults"
            :key="result.note.id"
            :note="result.note"
            :is-following="followedItems.has(result.note.id)"
            @click="viewNote"
            @follow="handleFollowNote"
            @unfollow="handleUnfollowNote"
          />
        </SearchResultsColumn>

        <!-- Flashcards Column -->
        <SearchResultsColumn
          title="Flashcards"
          icon="🎴"
          :result-count="flashcardsResults.length"
          :search-term="lastSearchTerm"
          empty-message="flashcard sets found"
        >
          <FlashcardResultCard
            v-for="result in flashcardsResults"
            :key="result.flashcardSet.id"
            :flashcard-set="result.flashcardSet"
            :is-following="followedItems.has(result.flashcardSet.id)"
            @click="viewFlashcardSet"
            @follow="handleFollowFlashcard"
            @unfollow="handleUnfollowFlashcard"
          />
        </SearchResultsColumn>
      </div>

      <div v-if="!hasSearched && !isSearching" class="initial-state">
        <div class="search-icon">🔎</div>
        <h2>Start Searching</h2>
        <p>Search above to find notes and flashcards from any user</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user'
import { NotesAPI } from '../api/concepts/NotesAPI'
import { FlashCardsAPI } from '../api/concepts/FlashCardsAPI'
import { FollowingAPI } from '../api/concepts/Following'
import SearchBar from '../components/search/SearchBar.vue'
import SearchResultsColumn from '../components/search/SearchResultsColumn.vue'
import NoteResultCard from '../components/search/NoteResultCard.vue'
import FlashcardResultCard from '../components/search/FlashcardResultCard.vue'
import type { SearchNotesResult, SearchFlashcardsResult } from '../api/types'

const router = useRouter()
const userStore = useUserStore()

// State
const lastSearchTerm = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const searchError = ref<string | null>(null)
const notesResults = ref<SearchNotesResult[]>([])
const flashcardsResults = ref<SearchFlashcardsResult[]>([])
const followedItems = ref<Set<string>>(new Set())

// Methods
const loadFollowedItems = async () => {
  if (!userStore.userId) return
  
  try {
    const response = await FollowingAPI.getFollowedItems({ user: userStore.userId })
    if (response.data) {
      followedItems.value = response.data.reduce((set, item) => {
        set.add(item.item)
        return set
      }, new Set<string>()) 
    }
  } catch (error) {
    console.error('Failed to load followed items:', error)
  }
}

const handleSearch = async (searchTerm: string) => {
  isSearching.value = true
  hasSearched.value = true
  lastSearchTerm.value = searchTerm
  searchError.value = null
  notesResults.value = []
  flashcardsResults.value = []

  try {
    // Search both Notes and FlashCards in parallel
    const [notesResponse, flashcardsResponse] = await Promise.all([
      NotesAPI.searchNotes({ searchTerm }),
      FlashCardsAPI.searchFlashcards({ searchTerm })
    ])

    if (notesResponse.error) {
      searchError.value = `Notes search error: ${notesResponse.error}`
    } else if (notesResponse.data) {
      notesResults.value = notesResponse.data.filter(item => item.note.notesOwner != userStore.userId)
    }

    if (flashcardsResponse.error) {
      if (searchError.value) {
        searchError.value += ` | Flashcards search error: ${flashcardsResponse.error}`
      } else {
        searchError.value = `Flashcards search error: ${flashcardsResponse.error}`
      }
    } else if (flashcardsResponse.data) {
      flashcardsResults.value = flashcardsResponse.data.filter(item => item.flashcardSet.setOwner != userStore.userId)
    }
  } catch (error) {
    searchError.value = 'An unexpected error occurred during search'
    console.error('Search error:', error)
  } finally {
    isSearching.value = false
  }
}

const viewNote = (note: SearchNotesResult['note']) => {
  // Navigate to the note view page with the owner as a query parameter
  router.push({
    path: `/notes/${note.name}`,
    query: { user: note.notesOwner }
  })
}

const viewFlashcardSet = (flashcardSet: SearchFlashcardsResult['flashcardSet']) => {
  // Navigate to the flashcard view page with the owner as a query parameter
  router.push({
    path: `/flashcards/${flashcardSet.name}`,
    query: { user: flashcardSet.setOwner }
  })
}

const handleFollowNote = async (noteId: string) => {
  if (!userStore.userId) {
    searchError.value = 'You must be logged in to follow items'
    return
  }
  
  try {
    const response = await FollowingAPI.follow({
      user: userStore.userId,
      item: noteId
    })
    
    if (response.error) {
      searchError.value = `Failed to follow note: ${response.error}`
    } else {
      followedItems.value.add(noteId)
    }
  } catch (error) {
    searchError.value = 'An error occurred while following the note'
    console.error('Follow error:', error)
  }
}

const handleUnfollowNote = async (noteId: string) => {
  if (!userStore.userId) return
  
  try {
    const response = await FollowingAPI.unfollow({
      user: userStore.userId,
      item: noteId
    })
    
    if (response.error) {
      searchError.value = `Failed to unfollow note: ${response.error}`
    } else {
      followedItems.value.delete(noteId)
    }
  } catch (error) {
    searchError.value = 'An error occurred while unfollowing the note'
    console.error('Unfollow error:', error)
  }
}

const handleFollowFlashcard = async (flashcardId: string) => {
  if (!userStore.userId) {
    searchError.value = 'You must be logged in to follow items'
    return
  }
  
  try {
    const response = await FollowingAPI.follow({
      user: userStore.userId,
      item: flashcardId
    })
    
    if (response.error) {
      searchError.value = `Failed to follow flashcard: ${response.error}`
    } else {
      followedItems.value.add(flashcardId)
    }
  } catch (error) {
    searchError.value = 'An error occurred while following the flashcard'
    console.error('Follow error:', error)
  }
}

const handleUnfollowFlashcard = async (flashcardId: string) => {
  if (!userStore.userId) return
  
  try {
    const response = await FollowingAPI.unfollow({
      user: userStore.userId,
      item: flashcardId
    })
    
    if (response.error) {
      searchError.value = `Failed to unfollow flashcard: ${response.error}`
    } else {
      followedItems.value.delete(flashcardId)
    }
  } catch (error) {
    searchError.value = 'An error occurred while unfollowing the flashcard'
    console.error('Unfollow error:', error)
  }
}

// Load followed items on mount
onMounted(() => {
  loadFollowedItems()
})
</script>

<style scoped>
.view-search {
  max-width: 1600px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  font-family: var(--font-heading, 'EB Garamond', serif);
  color: var(--accent-leather, #A67C52);
  margin: 0 0 10px 0;
  font-size: 2.5rem;
  font-weight: 700;
  letter-spacing: -0.5px;
}

.subtitle {
  font-family: var(--font-body, 'Noto Sans', sans-serif);
  color: var(--text-body, #2F2F2F);
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.8;
  line-height: 1.6;
}

.search-container {
  background: white;
  border-radius: 12px;
  padding: 30px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid var(--border-gold, #CBBF7A);
}

.results-summary {
  font-family: var(--font-body, 'Noto Sans', sans-serif);
  text-align: center;
  padding: 16px;
  background: var(--bg-parchment, #F8F5E9);
  border-radius: 8px;
  margin-bottom: 24px;
  color: var(--accent-leather, #A67C52);
  font-weight: 600;
  font-size: 1.1rem;
  border: 2px solid var(--border-gold, #CBBF7A);
  line-height: 1.6;
}

.error-message {
  background: #f8d7da;
  color: #721c24;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 24px;
  border: 1px solid #f5c6cb;
}

.results-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

.initial-state {
  text-align: center;
  padding: 80px 20px;
}

.search-icon {
  font-size: 5rem;
  margin-bottom: 24px;
  opacity: 0.5;
}

.initial-state h2 {
  font-family: var(--font-heading, 'EB Garamond', serif);
  color: var(--accent-leather, #A67C52);
  margin: 0 0 16px 0;
  font-size: 2rem;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.initial-state p {
  font-family: var(--font-body, 'Noto Sans', sans-serif);
  color: var(--text-body, #2F2F2F);
  font-size: 1.2rem;
  margin: 0;
  opacity: 0.7;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .results-grid {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .header h1 {
    font-size: 2rem;
  }
}
</style>
