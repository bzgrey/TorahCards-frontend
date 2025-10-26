<template>
  <button 
    class="follow-button" 
    :class="{ following: isFollowing }"
    @click.stop="handleClick"
    :disabled="isLoading"
  >
    {{ isFollowing ? '✓ Following' : '+ Follow' }}
  </button>
</template>

<script setup lang="ts">
interface Props {
  isFollowing: boolean
  isLoading?: boolean
}

interface Emits {
  (e: 'toggle'): void
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const handleClick = () => {
  if (!props.isLoading) {
    emit('toggle')
  }
}
</script>

<style scoped>
.follow-button {
  background: #007bff;
  color: white;
  border: none;
  padding: 8px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.95rem;
  font-weight: 600;
  transition: all 0.2s;
}

.follow-button:hover:not(:disabled) {
  background: #0056b3;
  transform: translateY(-1px);
}

.follow-button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.follow-button.following {
  background: #28a745;
}

.follow-button.following:hover:not(:disabled) {
  background: #dc3545;
}

.follow-button.following:hover:not(:disabled)::before {
  content: '✗ Unfollow';
  position: absolute;
  background: #dc3545;
  padding: 8px 20px;
  border-radius: 6px;
  margin-left: -20px;
}
</style>
