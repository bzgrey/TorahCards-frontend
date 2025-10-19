<template>
  <div class="note-item">
    <div class="note-header">
      <div class="title-section">
        <h3 v-if="!isEditingTitle">{{ note.name }}</h3>
        <input
          v-else
          v-model="editedName"
          type="text"
          class="title-input"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
        />
        <button @click="toggleTitleEdit" class="btn-icon">
          {{ isEditingTitle ? '✓' : '✏️' }}
        </button>
      </div>
      <div class="note-meta">
        {{ contentLength }} characters
      </div>
    </div>

    <div class="note-content">
      <div v-if="!isEditing" class="content-view">
        <pre class="content-text">{{ note.content }}</pre>
      </div>

      <div v-else class="content-edit">
        <textarea
          v-model="editedContent"
          placeholder="Enter your notes here..."
          rows="15"
          class="content-textarea"
        />
      </div>
    </div>

    <div class="note-actions">
      <button v-if="!isEditing" @click="startEdit" class="btn btn-edit">
        ✏️ Edit Content
      </button>
      <button v-if="!isEditing" @click="handleConvertToFlashcards" class="btn btn-convert" :disabled="converting">
        {{ converting ? '🔄 Converting...' : '🎴 Convert to Flashcards' }}
      </button>
      <button v-if="!isEditing" @click="handleRemove" class="btn btn-remove">
        🗑️ Delete Note
      </button>
      <button v-if="isEditing" @click="saveEdit" class="btn btn-save">
        ✓ Save Changes
      </button>
      <button v-if="isEditing" @click="cancelEdit" class="btn btn-cancel">
        ✗ Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import type { Notes } from '../api/types.ts'

const props = defineProps({
  note: {
    type: Object as PropType<Notes>,
    required: true
  }
})

const emit = defineEmits<{
  update: [name: string, content: string]
  remove: []
  updateName: [newName: string]
  convertToFlashcards: []
}>()

const isEditing = ref(false)
const isEditingTitle = ref(false)
const editedName = ref(props.note.name)
const editedContent = ref(props.note.content)
const converting = ref(false)

const contentLength = computed(() => props.note.content.length)

const toggleTitleEdit = () => {
  if (isEditingTitle.value) {
    saveTitle()
  } else {
    isEditingTitle.value = true
    editedName.value = props.note.name
  }
}

const saveTitle = () => {
  if (editedName.value.trim() && editedName.value !== props.note.name) {
    emit('updateName', editedName.value)
  }
  isEditingTitle.value = false
}

const startEdit = () => {
  isEditing.value = true
  editedContent.value = props.note.content
}

const saveEdit = () => {
  if (editedContent.value.trim()) {
    emit('update', props.note.name, editedContent.value)
    isEditing.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editedContent.value = props.note.content
}

const handleRemove = () => {
  if (confirm(`Are you sure you want to delete the note "${props.note.name}"?`)) {
    emit('remove')
  }
}

const handleConvertToFlashcards = () => {
  converting.value = true
  emit('convertToFlashcards')
  // Reset converting state after a delay
  setTimeout(() => {
    converting.value = false
  }, 2000)
}
</script>

<style scoped>
.note-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 24px;
  background: white;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.note-header {
  margin-bottom: 20px;
  padding-bottom: 15px;
  border-bottom: 2px solid #e9ecef;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}

.title-section h3 {
  margin: 0;
  color: #333;
  font-size: 22px;
  font-weight: 600;
}

.title-input {
  font-size: 22px;
  font-weight: 600;
  padding: 5px 10px;
  border: 2px solid #007bff;
  border-radius: 4px;
  flex: 1;
}

.btn-icon {
  background: #007bff;
  color: white;
  border: none;
  padding: 6px 10px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
}

.btn-icon:hover {
  opacity: 0.8;
}

.note-meta {
  color: #6c757d;
  font-size: 14px;
}

.note-content {
  margin-bottom: 20px;
}

.content-view {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 6px;
  padding: 20px;
  min-height: 200px;
}

.content-text {
  font-family: 'Georgia', 'Times New Roman', serif;
  font-size: 16px;
  line-height: 1.6;
  color: #333;
  white-space: pre-wrap;
  word-wrap: break-word;
  margin: 0;
}

.content-edit {
  width: 100%;
}

.content-textarea {
  width: 100%;
  padding: 15px;
  border: 2px solid #007bff;
  border-radius: 6px;
  font-size: 16px;
  font-family: 'Georgia', 'Times New Roman', serif;
  line-height: 1.6;
  resize: vertical;
  min-height: 300px;
}

.content-textarea:focus {
  outline: none;
  border-color: #0056b3;
  box-shadow: 0 0 0 3px rgba(0, 123, 255, 0.1);
}

.note-actions {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 15px;
  font-weight: 500;
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

.btn-edit {
  background: #ffc107;
  color: #000;
}

.btn-convert {
  background: #17a2b8;
  color: white;
}

.btn-remove {
  background: #dc3545;
  color: white;
}

.btn-save {
  background: #28a745;
  color: white;
}

.btn-cancel {
  background: #6c757d;
  color: white;
}

@media (max-width: 768px) {
  .note-item {
    padding: 16px;
  }

  .note-actions {
    flex-direction: column;
  }

  .btn {
    width: 100%;
  }
}
</style>
