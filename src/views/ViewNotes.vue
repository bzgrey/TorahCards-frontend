<template>
  <div class="view-notes">
    <div v-if="loading" class="loading">Loading note...</div>
    <div v-else-if="error" class="error">{{ error }}</div>
    <div v-else-if="!currentNote" class="empty">
      <p>Note not found</p>
      <router-link to="/" class="btn btn-primary">Go Home</router-link>
    </div>
    
    <NoteItem
      v-else
      :note="currentNote"
      :read-only="isReadOnly"
      @update="handleUpdate"
      @remove="handleDelete"
      @update-name="handleUpdateName"
      @convertToFlashcards="handleConvertToFlashcards"
    />

    <!-- Flashcards Modal -->
    <div v-if="showFlashcardsModal" class="flashcards-modal-overlay" @click.self="closeFlashcardsModal">
      <div class="flashcards-modal">
        <button @click="closeFlashcardsModal" class="btn-close">✕</button>
        <h2>Generated Flashcards</h2>
        <p class="modal-subtitle">Review and save these flashcards to your collection</p>
        
        <div v-if="generatedFlashcards.length > 0" class="flashcards-preview">
          <div v-for="(card, index) in generatedFlashcards" :key="index" class="flashcard-preview-item">
            <div class="card-number">Card {{ index + 1 }}</div>
            <div class="card-content">
              <div class="card-q">
                <strong>Q:</strong> {{ card.question }}
              </div>
              <div class="card-a">
                <strong>A:</strong> {{ card.answer }}
              </div>
            </div>
          </div>
        </div>

        <div class="modal-actions">
          <div class="form-group">
            <label>Flashcard Set Name</label>
            <input
              v-model="flashcardSetName"
              type="text"
              placeholder="Enter flashcard set name"
              class="text-input"
            />
          </div>
          <button @click="handleSaveFlashcards" class="btn btn-save" :disabled="!flashcardSetName.trim() || savingFlashcards">
            {{ savingFlashcards ? 'Saving...' : '💾 Save as Flashcard Set' }}
          </button>
          <button @click="closeFlashcardsModal" class="btn btn-cancel">
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import NoteItem from '../components/NoteItem.vue'
import { useNotesStore } from '../stores/notes'
import { useFlashcardsStore } from '../stores/flashcards'
import { useUserStore } from '../stores/user'
import type { Card } from '../api/types.ts'

const route = useRoute()
const router = useRouter()
const notesStore = useNotesStore()
const flashcardsStore = useFlashcardsStore()
const userStore = useUserStore()

// State
const showFlashcardsModal = ref(false)
const generatedFlashcards = ref<Card[]>([])
const flashcardSetName = ref('')
const savingFlashcards = ref(false)

// Use store state
const loading = computed(() => notesStore.loading)
const error = computed(() => notesStore.error)
const currentNote = computed(() => notesStore.currentNote)
const noteName = computed(() => notesStore.currentNoteName)

// Get user - use mock user if not authenticated
const username = computed(() => userStore.currentUser?.username || 'testUser')

// Get the owner from query params if viewing another user's note
const noteOwner = computed(() => (route.query.user as string) || username.value)
const isReadOnly = computed(() => noteOwner.value !== username.value)

const handleUpdate = async (name: string, content: string) => {
  try {
    const success = await notesStore.updateNote(username.value, name, content)
    
    if (!success) {
      alert(`Error updating note: ${notesStore.error}`)
      return
    }
    
    // Reload the note
    await loadNote()
  } catch (err) {
    alert('Failed to update note')
  }
}

const handleDelete = async () => {
  try {
    const success = await notesStore.removeNote(username.value, noteName.value)
    
    if (!success) {
      alert(`Error: ${notesStore.error}`)
    } else {
      router.push('/')
    }
  } catch (err) {
    alert('Failed to delete note')
  }
}

const handleUpdateName = async (newName: string) => {
  try {
    const oldName = noteName.value
    const content = currentNote.value?.content || ''
    
    // Add new note
    const addSuccess = await notesStore.addNote(username.value, newName, content)
    if (!addSuccess) {
      alert(`Error: ${notesStore.error}`)
      return
    }
    
    // Remove old note
    const removeSuccess = await notesStore.removeNote(username.value, oldName)
    if (!removeSuccess) {
      alert(`Error: ${notesStore.error}`)
      return
    }
    
    // Navigate to the new note name
    router.push(`/notes/${newName}`)
  } catch (err) {
    alert('Failed to update note name')
  }
}

const handleConvertToFlashcards = async () => {
  console.log('Converting note to flashcards...')
  if (!currentNote.value) return
  console.log('Converting note to flashcards 2...')

  const flashcards = await notesStore.convertNotesToFlashCards(
    username.value,
    noteName.value
  )
  console.log('Flashcards generated:', flashcards);
  if (flashcards && flashcards.length > 0) {
    generatedFlashcards.value = flashcards
    flashcardSetName.value = `${noteName.value} - Flashcards`
    showFlashcardsModal.value = true
  } else {
    alert(`Error: ${notesStore.error || 'No flashcards generated'}`)
  }
}

const handleSaveFlashcards = async () => {
  if (!flashcardSetName.value.trim() || generatedFlashcards.value.length === 0) return
  
  savingFlashcards.value = true
  const success = await flashcardsStore.addFlashcardSet(
    username.value,
    flashcardSetName.value.trim(),
    generatedFlashcards.value
  )
  
  if (success) {
    const flashCardsName = flashcardSetName.value.trim()
    closeFlashcardsModal()
    // navigate to the flashcards view
    router.push(`/flashcards/${flashCardsName}`)
  } else {
    alert(`Error: ${flashcardsStore.error}`)
  }
  
  savingFlashcards.value = false
}

const closeFlashcardsModal = () => {
  showFlashcardsModal.value = false
  generatedFlashcards.value = []
  flashcardSetName.value = ''
}

const loadNote = async () => {
  // Clear any previous errors
  notesStore.clearError()
  
  // Get the note name from route params
  const noteNameParam = route.params.id as string || 'Note'

  // Fetch note from store using the note owner (could be current user or another user)
  await notesStore.fetchNote(noteOwner.value, noteNameParam)  
}

onMounted(() => {
  loadNote()
})
</script>

<style scoped>
.view-notes {
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

.flashcards-modal-overlay {
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
  overflow-y: auto;
}

.flashcards-modal {
  background: white;
  border-radius: 12px;
  max-width: 800px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
  padding: 30px;
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3);
}

.flashcards-modal h2 {
  margin: 0 0 8px 0;
  color: #007bff;
}

.modal-subtitle {
  color: #6c757d;
  margin: 0 0 24px 0;
}

.flashcards-preview {
  max-height: 400px;
  overflow-y: auto;
  margin-bottom: 24px;
}

.flashcard-preview-item {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 12px;
}

.card-number {
  font-size: 12px;
  font-weight: 600;
  color: #007bff;
  margin-bottom: 8px;
}

.card-content {
  font-size: 14px;
}

.card-q {
  margin-bottom: 8px;
  color: #333;
}

.card-a {
  color: #28a745;
}

.modal-actions {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 2px solid #e9ecef;
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

.btn-add {
  background: #28a745;
  color: white;
}

.btn-save {
  background: #007bff;
  color: white;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

.btn-retry {
  background: #007bff;
  color: white;
  margin-top: 20px;
}

@media (max-width: 768px) {
  .flashcards-modal {
    max-height: 95vh;
    padding: 15px;
  }

  .modal-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
