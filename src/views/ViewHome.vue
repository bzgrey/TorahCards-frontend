<template>
  <div class="view-home">
    <div class="header">
      <h1>📚 Torah Cards Dashboard</h1>
      <p class="subtitle">Welcome, {{ username }}!</p>
    </div>

    <div class="dashboard-container">
      <!-- My Content Section -->
      <section class="content-section">
        <h2 class="section-title">📝 My Content</h2>
        
        <div class="content-grid">
          <!-- My Notes -->
          <div class="content-card">
            <div class="card-header">
              <h3>📄 My Notes</h3>
              <span class="badge">{{ myNotes.length }}</span>
            </div>
            
            <div v-if="notesLoading" class="loading-state">Loading...</div>
            <div v-else-if="notesError" class="error-state">{{ notesError }}</div>
            <div v-else-if="myNotes.length === 0" class="empty-state">
              <p>No notes yet</p>
              <button @click="createNote" class="btn btn-create">+ Create Note</button>
            </div>
            <div v-else class="items-list">
              <div 
                v-for="note in myNotes" 
                :key="note.name" 
                class="item"
                @click="viewNote(note.name)"
              >
                <div class="item-name">{{ note.name }}</div>
                <div class="item-preview">{{ getPreview(note.content) }}</div>
              </div>
              <button @click="createNote" class="btn btn-create-small">+ New Note</button>
            </div>
          </div>

          <!-- My Flashcards -->
          <div class="content-card">
            <div class="card-header">
              <h3>🎴 My Flashcards</h3>
              <span class="badge">{{ myFlashcards.length }}</span>
            </div>
            
            <div v-if="flashcardsLoading" class="loading-state">Loading...</div>
            <div v-else-if="flashcardsError" class="error-state">{{ flashcardsError }}</div>
            <div v-else-if="myFlashcards.length === 0" class="empty-state">
              <p>No flashcard sets yet</p>
              <button @click="createFlashcardSet" class="btn btn-create">+ Create Set</button>
            </div>
            <div v-else class="items-list">
              <div 
                v-for="set in myFlashcards" 
                :key="set.name" 
                class="item"
                @click="viewFlashcardSet(set.name)"
              >
                <div class="item-name">{{ set.name }}</div>
                <div class="item-count">{{ set.cards?.length || 0 }} cards</div>
              </div>
              <button @click="createFlashcardSet" class="btn btn-create-small">+ New Set</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Following Section-->
      <FollowingSection
        :followed-notes="followedNotes"
        :followed-flashcards="followedFlashcards"
        :loading="followingLoading"
        :error="followingError"
        @view-note="viewFollowedNote"
        @view-flashcard="viewFollowedFlashcard"
        @unfollow-note="handleUnfollowNote"
        @unfollow-flashcard="handleUnfollowFlashcard"
      />
    </div>

    <!-- Create Note Modal -->
    <div v-if="showCreateNoteModal" class="modal-overlay" @click.self="closeCreateNoteModal">
      <div class="modal">
        <button @click="closeCreateNoteModal" class="btn-close">✕</button>
        <h2>Create New Note</h2>
        <div class="form-group">
          <label>Note Name</label>
          <input
            v-model="newNoteName"
            type="text"
            placeholder="Enter note name"
            class="text-input"
            @keyup.enter="handleCreateNote"
          />
        </div>
        <div class="form-group">
          <label>Content</label>
          <textarea
            v-model="newNoteContent"
            placeholder="Enter note content"
            class="textarea-input"
            rows="6"
          ></textarea>
        </div>
        <div class="modal-actions">
          <button @click="handleCreateNote" class="btn btn-primary" :disabled="!newNoteName.trim()">
            Create
          </button>
          <button @click="closeCreateNoteModal" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>

    <!-- Create Flashcard Set Modal -->
    <div v-if="showCreateFlashcardModal" class="modal-overlay" @click.self="closeCreateFlashcardModal">
      <div class="modal">
        <button @click="closeCreateFlashcardModal" class="btn-close">✕</button>
        <h2>Create New Flashcard Set</h2>
        <div class="form-group">
          <label>Set Name</label>
          <input
            v-model="newSetName"
            type="text"
            placeholder="Enter flashcard set name"
            class="text-input"
            @keyup.enter="handleCreateFlashcardSet"
          />
        </div>
        <div class="modal-actions">
          <button @click="handleCreateFlashcardSet" class="btn btn-primary" :disabled="!newSetName.trim()">
            Create
          </button>
          <button @click="closeCreateFlashcardModal" class="btn btn-secondary">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { NotesAPI } from '../api/concepts/NotesAPI'
import { FlashCardsAPI } from '../api/concepts/FlashCardsAPI'
import { FollowingAPI } from '../api/concepts/Following'
import { useUserStore } from '../stores/user'
import FollowingSection from '../components/FollowingSection.vue'
import type { Notes, FlashCards, GetNotesInfoResponse, GetFlashcardInfoResponse } from '../api/types'

const router = useRouter()
const userStore = useUserStore()

// State
const showCreateNoteModal = ref(false)
const showCreateFlashcardModal = ref(false)
const newNoteName = ref('')
const newNoteContent = ref('')
const newSetName = ref('')
const allNotes = ref<Notes[]>([])
const allFlashcards = ref<FlashCards[]>([])
const notesLoading = ref(false)
const notesError = ref<string | null>(null)
const flashcardsLoading = ref(false)
const flashcardsError = ref<string | null>(null)
const followingLoading = ref(false)
const followingError = ref<string | null>(null)
const followedNotes = ref<GetNotesInfoResponse[]>([])
const followedFlashcards = ref<GetFlashcardInfoResponse[]>([])

// Computed
const username = computed(() => userStore.username || 'testUser')
const myNotes = computed(() => allNotes.value)
const myFlashcards = computed(() => allFlashcards.value)

// Methods
const getPreview = (content: string) => {
  if (!content) return 'Empty note'
  return content.length > 80 ? content.substring(0, 80) + '...' : content
}

const viewNote = (name: string) => {
  router.push(`/notes/${name}`)
}

const viewFlashcardSet = (name: string) => {
  router.push(`/flashcards/${name}`)
}

const createNote = () => {
  showCreateNoteModal.value = true
}

const createFlashcardSet = () => {
  showCreateFlashcardModal.value = true
}

const closeCreateNoteModal = () => {
  showCreateNoteModal.value = false
  newNoteName.value = ''
  newNoteContent.value = ''
}

const closeCreateFlashcardModal = () => {
  showCreateFlashcardModal.value = false
  newSetName.value = ''
}

const fetchUserNotes = async () => {
  if (!userStore.userId) return
  
  notesLoading.value = true
  notesError.value = null
  
  const result = await NotesAPI.getUserNotes({ user: userStore.userId })
  
  if (result.error) {
    notesError.value = result.error
  } else if (result.data) {
    allNotes.value = result.data
  }
  
  notesLoading.value = false
}

const fetchUserFlashcards = async () => {
  if (!userStore.userId) return
  
  flashcardsLoading.value = true
  flashcardsError.value = null
  
  const result = await FlashCardsAPI.getUserCards({ user: userStore.userId })
  
  if (result.error) {
    flashcardsError.value = result.error
  } else if (result.data) {
    allFlashcards.value = result.data
  }
  
  flashcardsLoading.value = false
}

const handleCreateNote = async () => {
  if (!newNoteName.value.trim() || !userStore.userId) return
  
  notesLoading.value = true
  const result = await NotesAPI.addNotes({
    user: userStore.userId,
    name: newNoteName.value.trim(),
    content: newNoteContent.value
  })
  
  if (result.error) {
    alert(`Error creating note: ${result.error}`)
  } else {
    const newNameTemp = newNoteName.value.trim()
    closeCreateNoteModal()
    await fetchUserNotes() // Refresh the list
    // Navigate to the new note
    router.push(`/notes/${newNameTemp}`)
  }
  
  notesLoading.value = false
}

const handleCreateFlashcardSet = async () => {
  if (!newSetName.value.trim() || !userStore.userId) return
  
  flashcardsLoading.value = true
  const result = await FlashCardsAPI.addFlashCards({
    user: userStore.userId,
    name: newSetName.value.trim(),
    cards: []
  })
  
  if (result.error) {
    alert(`Error creating flashcard set: ${result.error}`)
  } else {
    const flashCardSetName = newSetName.value.trim()
    closeCreateFlashcardModal()
    await fetchUserFlashcards() // Refresh the list
    // Navigate to the new flashcard set
    router.push(`/flashcards/${flashCardSetName}`)
  }
  
  flashcardsLoading.value = false
}

const fetchFollowedItems = async () => {
  if (!userStore.userId) return
  
  followingLoading.value = true
  followingError.value = null
  
  try {
    // Get list of followed item IDs
    const followedItemsResult = await FollowingAPI.getFollowedItems({ user: userStore.userId })
    
    if (followedItemsResult.error) {
      followingError.value = followedItemsResult.error
      followingLoading.value = false
      return
    }
    
    if (!followedItemsResult.data || followedItemsResult.data.length === 0) {
      followedNotes.value = []
      followedFlashcards.value = []
      followingLoading.value = false
      return
    }

    const itemIds = followedItemsResult.data.map(item => item.item)
    // Fetch notes and flashcards info in parallel
    const [notesResult, flashcardsResult] = await Promise.all([
      NotesAPI.getNotesInfo({ noteIDs: itemIds }),
      FlashCardsAPI.getFlashcardInfo({ flashcardIDs: itemIds })
    ])
    if (notesResult.error) {
      console.error('Error fetching followed notes:', notesResult.error)
    } else if (notesResult.data) {
      followedNotes.value = notesResult.data
    }
    
    if (flashcardsResult.error) {
      console.error('Error fetching followed flashcards:', flashcardsResult.error)
    } else if (flashcardsResult.data) {
      followedFlashcards.value = flashcardsResult.data
      console.log('Fetched followed flashcards:', followedFlashcards.value)
    }
  } catch (error) {
    followingError.value = 'Failed to load followed items'
    console.error('Error fetching followed items:', error)
  } finally {
    followingLoading.value = false
  }
}

const handleUnfollowNote = async (noteId: string) => {
  if (!userStore.userId) return
  console.log('Unfollowing Note with ID:', noteId)

  try {
    const result = await FollowingAPI.unfollow({
      user: userStore.userId,
      item: noteId
    })
    
    if (result.error) {
      alert(`Failed to unfollow note: ${result.error}`)
    } else {
      // Remove from local list
      followedNotes.value = followedNotes.value.filter(note => note._id !== noteId)
    }
  } catch (error) {
    alert('An error occurred while unfollowing the note')
    console.error('Unfollow error:', error)
  }
}

const handleUnfollowFlashcard = async (flashcardId: string) => {
  if (!userStore.userId) return
  try {
    const result = await FollowingAPI.unfollow({
      user: userStore.userId,
      item: flashcardId
    })
    
    if (result.error) {
      alert(`Failed to unfollow flashcard: ${result.error}`)
    } else {
      // Remove from local list
      followedFlashcards.value = followedFlashcards.value.filter(fc => fc._id !== flashcardId)
    }
  } catch (error) {
    alert('An error occurred while unfollowing the flashcard')
    console.error('Unfollow error:', error)
  }
}

const viewFollowedNote = (note: GetNotesInfoResponse) => {
  router.push({
    path: `/notes/${note.name}`,
    query: { user: note.user }
  })
}

const viewFollowedFlashcard = (flashcard: GetFlashcardInfoResponse) => {
  router.push({
    path: `/flashcards/${flashcard.name}`,
    query: { user: flashcard.user }
  })
}

const loadDashboardData = async () => {
  // Load user's notes and flashcards, and followed notes and flashcards
  await Promise.all([
    fetchUserNotes(),
    fetchUserFlashcards(),
    fetchFollowedItems()
  ])
}

onMounted(() => {
  loadDashboardData()
})
</script>

<style scoped>
.view-home {
  max-width: 1400px;
  margin: 0 auto;
  padding: 40px 20px;
}

.header {
  text-align: center;
  margin-bottom: 40px;
}

.header h1 {
  color: #007bff;
  margin: 0 0 10px 0;
  font-size: 2.5rem;
}

.subtitle {
  color: #6c757d;
  font-size: 1.2rem;
  margin: 0;
}

.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 40px;
}

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

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 600;
  transition: all 0.2s;
}

.btn:hover:not(:disabled) {
  opacity: 0.85;
  transform: translateY(-1px);
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-create {
  background: #28a745;
  color: white;
  width: 100%;
}

.btn-create-small {
  background: #007bff;
  color: white;
  width: 100%;
  margin-top: 8px;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-secondary {
  background: #6c757d;
  color: white;
}

/* Modal Styles */
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
  max-width: 600px;
  width: 100%;
  padding: 30px;
  position: relative;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.modal h2 {
  margin: 0 0 24px 0;
  color: #007bff;
}

.btn-close {
  position: absolute;
  top: 15px;
  right: 15px;
  background: #dc3545;
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.2s;
}

.btn-close:hover {
  opacity: 0.8;
}

.form-group {
  margin-bottom: 20px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #333;
}

.text-input,
.textarea-input {
  width: 100%;
  padding: 12px;
  border: 2px solid #dee2e6;
  border-radius: 6px;
  font-size: 16px;
  transition: border-color 0.2s;
}

.text-input:focus,
.textarea-input:focus {
  outline: none;
  border-color: #007bff;
}

.textarea-input {
  resize: vertical;
  font-family: inherit;
}

.modal-actions {
  display: flex;
  gap: 12px;
  margin-top: 24px;
}

.modal-actions .btn {
  flex: 1;
}

@media (max-width: 768px) {
  .content-grid {
    grid-template-columns: 1fr;
  }
  
  .header h1 {
    font-size: 2rem;
  }
  
  .modal {
    padding: 20px;
  }
  
  .modal-actions {
    flex-direction: column;
  }
  
  .modal-actions .btn {
    width: 100%;
  }
}
</style>
