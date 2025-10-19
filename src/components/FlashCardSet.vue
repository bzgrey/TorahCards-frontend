<template>
  <div class="flashcard-set">
    <div class="set-header">
      <div class="title-section">
        <h2 v-if="!isEditingTitle">{{ setName }}</h2>
        <input
          v-else
          v-model="editedSetName"
          type="text"
          class="title-input"
          @blur="saveTitle"
          @keyup.enter="saveTitle"
        />
        <button @click="toggleTitleEdit" class="btn-icon">
          {{ isEditingTitle ? '✓' : '✏️' }}
        </button>
      </div>
      <div class="set-meta">
        {{ cards.length }} card{{ cards.length !== 1 ? 's' : '' }}
      </div>
    </div>

    <div class="cards-grid">
      <FlashCardItem
        v-for="(card, index) in cards"
        :key="`card-${index}`"
        :card="card"
        :card-index="index"
        @update="updateCard"
        @remove="removeCard"
      />
    </div>

    <div class="add-card-section">
      <button v-if="!showAddForm" @click="showAddForm = true" class="btn btn-add-card">
        ➕ Add New Card
      </button>

      <div v-else class="add-card-form">
        <h3>Add New Card</h3>
        <div class="form-group">
          <label>Question</label>
          <textarea
            v-model="newQuestion"
            placeholder="Enter question"
            rows="3"
          />
        </div>
        <div class="form-group">
          <label>Answer</label>
          <textarea
            v-model="newAnswer"
            placeholder="Enter answer"
            rows="3"
          />
        </div>
        <div class="form-actions">
          <button @click="addCard" class="btn btn-save" :disabled="!canAddCard">
            ✓ Add Card
          </button>
          <button @click="cancelAdd" class="btn btn-cancel">
            ✗ Cancel
          </button>
        </div>
      </div>
    </div>

    <div class="set-actions">
      <button @click="handleSave" class="btn btn-primary" :disabled="saving">
        {{ saving ? 'Saving...' : '💾 Save All Changes' }}
      </button>
      <button @click="handleDelete" class="btn btn-danger">
        🗑️ Delete Entire Set
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, type PropType } from 'vue'
import FlashCardItem from './FlashCardItem.vue'
import type { Card } from '../api/types.ts'

const props = defineProps({
  setName: {
    type: String,
    required: true
  },
  initialCards: {
    type: Array as PropType<Card[]>,
    default: () => []
  }
})

const emit = defineEmits<{
  save: [setName: string, cards: Card[]]
  delete: []
  updateSetName: [newName: string]
}>()

const cards = ref<Card[]>([...props.initialCards])
const isEditingTitle = ref(false)
const editedSetName = ref(props.setName)
const showAddForm = ref(false)
const newQuestion = ref('')
const newAnswer = ref('')
const saving = ref(false)

const canAddCard = computed(() => {
  return newQuestion.value.trim() !== '' && newAnswer.value.trim() !== ''
})

const toggleTitleEdit = () => {
  if (isEditingTitle.value) {
    saveTitle()
  } else {
    isEditingTitle.value = true
    editedSetName.value = props.setName
  }
}

const saveTitle = () => {
  if (editedSetName.value.trim() && editedSetName.value !== props.setName) {
    emit('updateSetName', editedSetName.value)
  }
  isEditingTitle.value = false
}

const updateCard = (index: number, updatedCard: Card) => {
  cards.value[index] = updatedCard
}

const removeCard = (index: number) => {
  cards.value.splice(index, 1)
}

const addCard = () => {
  if (canAddCard.value) {
    cards.value.push({
      question: newQuestion.value.trim(),
      answer: newAnswer.value.trim()
    })
    cancelAdd()
  }
}

const cancelAdd = () => {
  showAddForm.value = false
  newQuestion.value = ''
  newAnswer.value = ''
}

const handleSave = () => {
  saving.value = true
  emit('save', props.setName, cards.value)
  // Reset saving state after a delay (parent should handle actual save)
  setTimeout(() => {
    saving.value = false
  }, 1000)
}

const handleDelete = () => {
  if (confirm(`Are you sure you want to delete the entire "${props.setName}" flashcard set?`)) {
    emit('delete')
  }
}
</script>

<style scoped>
.flashcard-set {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}

.set-header {
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid #ddd;
}

.title-section {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.title-section h2 {
  margin: 0;
  color: #333;
}

.title-input {
  font-size: 24px;
  font-weight: bold;
  padding: 5px 10px;
  border: 2px solid #007bff;
  border-radius: 4px;
  flex: 1;
}

.btn-icon {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
}

.btn-icon:hover {
  opacity: 0.8;
}

.set-meta {
  color: #666;
  font-size: 16px;
}

.cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.add-card-section {
  margin: 40px 0;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
}

.btn-add-card {
  width: 100%;
  padding: 15px;
  background: #28a745;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn-add-card:hover {
  opacity: 0.8;
}

.add-card-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  border: 2px solid #28a745;
}

.add-card-form h3 {
  margin: 0 0 20px 0;
  color: #28a745;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: 600;
  color: #333;
  font-size: 14px;
}

textarea {
  width: 100%;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  font-family: inherit;
  resize: vertical;
}

textarea:focus {
  outline: none;
  border-color: #007bff;
}

.form-actions {
  display: flex;
  gap: 10px;
  margin-top: 15px;
}

.set-actions {
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 12px 24px;
  border: none;
  border-radius: 6px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.2s;
}

.btn:hover:not(:disabled) {
  opacity: 0.8;
}

.btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary {
  background: #007bff;
  color: white;
}

.btn-danger {
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
  .cards-grid {
    grid-template-columns: 1fr;
  }
  
  .set-actions {
    flex-direction: column;
  }
  
  .btn {
    width: 100%;
  }
}
</style>
