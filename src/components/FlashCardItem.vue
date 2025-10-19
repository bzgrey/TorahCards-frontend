<template>
  <div class="flashcard-item">
    <div v-if="!isEditing" class="card-view" :class="{ flipped: isFlipped }" @click="flip">
      <div class="card-inner">
        <div class="card-front">
          <div class="label">Question</div>
          <div class="content">{{ card.question }}</div>
        </div>
        <div class="card-back">
          <div class="label">Answer</div>
          <div class="content">{{ card.answer }}</div>
        </div>
      </div>
    </div>

    <div v-else class="card-edit">
      <div class="form-group">
        <label>Question</label>
        <textarea
          v-model="editedQuestion"
          placeholder="Enter question"
          rows="3"
        />
      </div>
      <div class="form-group">
        <label>Answer</label>
        <textarea
          v-model="editedAnswer"
          placeholder="Enter answer"
          rows="3"
        />
      </div>
    </div>

    <div class="card-actions">
      <button v-if="!isEditing" @click.stop="startEdit" class="btn btn-edit">
        ✏️ Edit
      </button>
      <button v-if="!isEditing" @click.stop="handleRemove" class="btn btn-remove">
        🗑️ Remove
      </button>
      <button v-if="isEditing" @click.stop="saveEdit" class="btn btn-save">
        ✓ Save
      </button>
      <button v-if="isEditing" @click.stop="cancelEdit" class="btn btn-cancel">
        ✗ Cancel
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, type PropType } from 'vue'
import type { Card } from '../api/types.ts'

const props = defineProps({
  card: {
    type: Object as PropType<Card>,
    required: true
  },
  cardIndex: {
    type: Number,
    required: true
  }
})

const emit = defineEmits<{
  update: [index: number, card: Card]
  remove: [index: number]
}>()

const isFlipped = ref(false)
const isEditing = ref(false)
const editedQuestion = ref(props.card.question)
const editedAnswer = ref(props.card.answer)

const flip = () => {
  if (!isEditing.value) {
    isFlipped.value = !isFlipped.value
  }
}

const startEdit = () => {
  isEditing.value = true
  editedQuestion.value = props.card.question
  editedAnswer.value = props.card.answer
}

const saveEdit = () => {
  if (editedQuestion.value.trim() && editedAnswer.value.trim()) {
    emit('update', props.cardIndex, {
      question: editedQuestion.value,
      answer: editedAnswer.value
    })
    isEditing.value = false
  }
}

const cancelEdit = () => {
  isEditing.value = false
  editedQuestion.value = props.card.question
  editedAnswer.value = props.card.answer
}

const handleRemove = () => {
  if (confirm('Are you sure you want to remove this card?')) {
    emit('remove', props.cardIndex)
  }
}
</script>

<style scoped>
.flashcard-item {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 20px;
  background: white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.card-view {
  width: 100%;
  height: 250px;
  perspective: 1000px;
  cursor: pointer;
  margin-bottom: 15px;
}

.card-inner {
  position: relative;
  width: 100%;
  height: 100%;
  transition: transform 0.6s;
  transform-style: preserve-3d;
}

.flipped .card-inner {
  transform: rotateY(180deg);
}

.card-front,
.card-back {
  position: absolute;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  border: 2px solid #007bff;
  border-radius: 8px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #f8f9fa;
}

.card-back {
  transform: rotateY(180deg);
  border-color: #28a745;
}

.label {
  font-size: 12px;
  font-weight: bold;
  color: #666;
  text-transform: uppercase;
  margin-bottom: 12px;
}

.content {
  font-size: 18px;
  text-align: center;
  color: #333;
  overflow-y: auto;
  max-height: 180px;
  width: 100%;
}

.card-edit {
  margin-bottom: 15px;
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

.card-actions {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}

.btn {
  padding: 8px 16px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: opacity 0.2s;
  font-weight: 500;
}

.btn:hover {
  opacity: 0.8;
}

.btn-edit {
  background: #ffc107;
  color: #000;
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
</style>
