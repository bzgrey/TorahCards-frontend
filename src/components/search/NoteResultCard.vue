<template>
  <div class="result-card">
    <div class="card-content" @click="handleClick">
      <div class="result-header">
        <h3 class="result-name">{{ note.name }}</h3>
      </div>
      <div class="result-owner">by {{ ownerUsername || note.notesOwner }}</div>
      <div class="result-preview">{{ getPreview(note.content) }}</div>
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
import type { SearchNotesResult } from '../../api/types'

interface Props {
  note: SearchNotesResult['note']
  isFollowing: boolean
}

interface Emits {
  (e: 'click', note: SearchNotesResult['note']): void
  (e: 'follow', noteId: string): void
  (e: 'unfollow', noteId: string): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const isLoading = ref(false)
const ownerUsername = ref<string | null>(null)

// Fetch the owner's username when component mounts
onMounted(async () => {
  const response = await UserAuthAPI.getUsernames({
    users: [props.note.notesOwner]
  })
  
  if (response.data && response.data.length > 0) {
    ownerUsername.value = response.data[0].username
  }
})

const getPreview = (content: string) => {
  if (!content) return 'Empty content'
  return content.length > 150 ? content.substring(0, 150) + '...' : content
}

const handleClick = () => {
  emit('click', props.note)
}

const handleFollowToggle = async () => {
  if (isLoading.value) return
  isLoading.value = true
  
  try {
    if (props.isFollowing) {
      emit('unfollow', props.note.id)
    } else {
      emit('follow', props.note.id)
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
