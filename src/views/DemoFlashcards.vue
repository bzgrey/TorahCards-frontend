<template>
  <div class="demo-flashcards">
    <div class="demo-header">
      <h1>📚 FlashCards Demo</h1>
      <p>This is a demo view with sample data - no backend required!</p>
    </div>

    <FlashCardSet
      :set-name="demoSetName"
      :initial-cards="demoCards"
      @save="handleSave"
      @delete="handleDelete"
      @update-set-name="handleUpdateSetName"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import FlashCardSet from '../components/FlashCardSet.vue'
import type { Card } from '../api/types.ts'

const demoSetName = ref('Torah Basics')

const demoCards = ref<Card[]>([
  {
    question: 'What does "Torah" mean?',
    answer: 'Torah means "instruction" or "teaching" in Hebrew'
  },
  {
    question: 'How many books are in the Torah?',
    answer: 'Five books: Genesis, Exodus, Leviticus, Numbers, and Deuteronomy'
  },
  {
    question: 'What is the first word of the Torah?',
    answer: 'Bereishit (בְּרֵאשִׁית) - "In the beginning"'
  },
  {
    question: 'What are the Ten Commandments also called?',
    answer: 'The Aseret HaDibrot (עֲשֶׂרֶת הַדִּבְּרוֹת) - "Ten Utterances"'
  },
  {
    question: 'Who received the Torah at Mount Sinai?',
    answer: 'Moses (Moshe) and the people of Israel'
  }
])

const handleSave = (name: string, cards: Card[]) => {
  console.log('💾 Save called with:')
  console.log('Set Name:', name)
  console.log('Cards:', cards)
  alert(`Saved "${name}" with ${cards.length} cards!\n(In production, this would save to your backend)`)
}

const handleDelete = () => {
  console.log('🗑️ Delete called')
  alert('Delete confirmed!\n(In production, this would delete from your backend)')
}

const handleUpdateSetName = (newName: string) => {
  demoSetName.value = newName
  console.log('✏️ Set name updated to:', newName)
}
</script>

<style scoped>
.demo-flashcards {
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 20px;
}

.demo-header {
  text-align: center;
  color: white;
  margin-bottom: 30px;
  padding: 30px 20px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
  max-width: 800px;
  margin: 0 auto 30px;
}

.demo-header h1 {
  margin: 0 0 10px 0;
  font-size: 36px;
}

.demo-header p {
  margin: 0;
  font-size: 18px;
  opacity: 0.9;
}
</style>
