<template>
  <div class="result-card">
    <div class="card-content" @click="handleClick">
      <div class="result-header">
        <h3 class="result-name">{{ flashcardSet.name }}</h3>
        <span class="card-count">{{ flashcardSet.cards.length }} cards</span>
      </div>
      <div class="result-owner">by {{ ownerUsername || flashcardSet.setOwner }}</div>
      <div class="result-preview">
        {{ flashcardSet.cards.length > 0 ? getCardsPreview(flashcardSet.cards) : 'Empty set' }}
      </div>
    </div>
    <div class="card-actions">
      <FollowButton 
        :is-following="isFollowing"
        :is-loading="isLoading"
        @toggle="handleFollowToggle"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import FollowButton from '../FollowButton.vue'
import { UserAuthAPI } from '../../api/concepts/UserAuthAPI'
import type { SearchFlashcardsResult, Card } from '../../api/types'

interface Props {
  flashcardSet: SearchFlashcardsResult['flashcardSet']
  isFollowing: boolean
}

interface Emits {
  (e: 'click', flashcardSet: SearchFlashcardsResult['flashcardSet']): void
  (e: 'follow', flashcardId: string): void
  (e: 'unfollow', flashcardId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isLoading = ref(false)
const ownerUsername = ref<string | null>(null)

// Fetch the owner's username when component mounts
onMounted(async () => {
  const response = await UserAuthAPI.getUsernames({
    users: [props.flashcardSet.setOwner]
  })
  
  if (response.data && response.data.length > 0) {
    ownerUsername.value = response.data[0].username
  }
})

const getCardsPreview = (cards: Card[]) => {
  if (cards.length === 0) return 'No cards'
  const firstCard = cards[0]
  const preview = `${firstCard.question}: ${firstCard.answer}`
  return preview.length > 100 ? preview.substring(0, 100) + '...' : preview
}

const handleClick = () => {
  emit('click', props.flashcardSet)
}

const handleFollowToggle = async () => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    if (props.isFollowing) {
      emit('unfollow', props.flashcardSet.id)
    } else {
      emit('follow', props.flashcardSet.id)
    }
  } finally {
    // Keep loading state until parent updates
    setTimeout(() => {
      isLoading.value = false
    }, 500)
  }
}
</script>

<style scoped>
.result-card {
  background: white;
  border: 2px solid var(--border-gold, #CBBF7A);
  border-radius: 8px;
  padding: 20px;
  transition: all 0.2s;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.result-card:hover {
  border-color: var(--accent-leather, #A67C52);
  box-shadow: 0 4px 12px rgba(166, 124, 82, 0.3);
  transform: translateY(-2px);
}

.card-content {
  cursor: pointer;
  flex: 1;
}

.result-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.result-name {
  font-family: var(--font-heading, 'EB Garamond', serif);
  margin: 0;
  color: var(--text-heading, #2B2B2B);
  font-size: 1.3rem;
  flex: 1;
  font-weight: 600;
  letter-spacing: -0.2px;
}

.card-count {
  font-family: var(--font-ui, 'Noto Sans', sans-serif);
  background: var(--accent-leather, #A67C52);
  color: white;
  padding: 4px 12px;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  letter-spacing: -0.3px;
}

.result-owner {
  font-family: var(--font-heading, 'EB Garamond', serif);
  color: var(--text-quote, #5A5A5A);
  font-size: 0.95rem;
  margin-bottom: 12px;
  font-style: italic;
}

.result-preview {
  font-family: var(--font-body, 'Noto Sans', sans-serif);
  color: var(--text-body, #2F2F2F);
  line-height: 1.6;
  font-size: 1rem;
  opacity: 0.8;
}

.card-actions {
  display: flex;
  justify-content: flex-end;
  padding-top: 8px;
  border-top: 1px solid var(--border-gold, #CBBF7A);
}
</style>
