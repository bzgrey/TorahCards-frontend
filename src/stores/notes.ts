import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { NotesAPI } from '../api/concepts/NotesAPI.ts'
import type { Notes, Card } from '../api/types.ts'

export const useNotesStore = defineStore('notes', () => {
  // State
  const allNotes = ref<Notes[]>([])
  const currentNote = ref<Notes | null>(null)
  const loading = ref(false)
  const error = ref<string | null>(null)

  // Getters
  const notesCount = computed(() => allNotes.value.length)
  const currentNoteName = computed(() => currentNote.value?.name || '')
  const currentNoteContent = computed(() => currentNote.value?.content || '')

  // Actions
  async function fetchUserNotes(user: string) {
    loading.value = true
    error.value = null
    
    try {
      const result = await NotesAPI.getUserNotes({ user })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      if (result.data) {
        allNotes.value = result.data
      }
      
      return true
    } catch (_err) {
      error.value = 'Failed to fetch notes'
      return false
    } finally {
      loading.value = false
    }
  }

  async function fetchNote(user: string, name: string) {
    loading.value = true
    error.value = null
    
    try {
      const result = await NotesAPI.getNotes({ user, name })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      if (result.data) {
        currentNote.value = {
          name,
          content: result.data.content
        }
      }
      
      return true
    } catch (_err) {
      error.value = 'Failed to fetch note'
      return false
    } finally {
      loading.value = false
    }
  }

  async function addNote(user: string, name: string, content: string) {
    loading.value = true
    error.value = null
    
    try {
      const result = await NotesAPI.addNotes({ user, name, content })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      // Refresh the notes list
      await fetchUserNotes(user)
      return true
    } catch (_err) {
      error.value = 'Failed to add note'
      return false
    } finally {
      loading.value = false
    }
  }

  async function updateNote(user: string, name: string, content: string) {
    loading.value = true
    error.value = null
    
    try {
      // Remove the old note
      const removeResult = await NotesAPI.removeNotes({ user, name })
      
      if (removeResult.error) {
        error.value = removeResult.error
        return false
      }
      
      // Add the updated note
      const addResult = await NotesAPI.addNotes({ user, name, content })
      
      if (addResult.error) {
        error.value = addResult.error
        return false
      }
      
      // Update current note
      if (currentNote.value?.name === name) {
        currentNote.value.content = content
      }
      
      return true
    } catch (_err) {
      error.value = 'Failed to update note'
      return false
    } finally {
      loading.value = false
    }
  }

  async function removeNote(user: string, name: string) {
    loading.value = true
    error.value = null
    
    try {
      const result = await NotesAPI.removeNotes({ user, name })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      // Remove from local state
      allNotes.value = allNotes.value.filter((note: Notes) => note.name !== name)
      
      // Clear current note if it was deleted
      if (currentNote.value?.name === name) {
        currentNote.value = null
      }
      
      return true
    } catch (_err) {
      error.value = 'Failed to remove note'
      return false
    } finally {
      loading.value = false
    }
  }

  async function convertNotesToFlashCards(user: string, name: string): Promise<Card[] | null> {
    loading.value = true
    error.value = null
    
    try {
      const result = await NotesAPI.notesToFlashCards({ user, name })
      if (result.error) {
        error.value = result.error
        return null
      }
      
      return result.data?.cards || null
    } catch (_err) {
      error.value = 'Failed to convert notes to flashcards'
      return null
    } finally {
      loading.value = false
    }
  }

  function clearError() {
    error.value = null
  }

  function clearCurrentNote() {
    currentNote.value = null
  }

  return {
    // State
    allNotes,
    currentNote,
    loading,
    error,
    
    // Getters
    notesCount,
    currentNoteName,
    currentNoteContent,
    
    // Actions
    fetchUserNotes,
    fetchNote,
    addNote,
    updateNote,
    removeNote,
    convertNotesToFlashCards,
    clearError,
    clearCurrentNote
  }
})
