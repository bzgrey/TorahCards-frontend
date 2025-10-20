import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ViewHome from './views/ViewHome.vue'
import ViewFlashcards from './views/ViewFlashcards.vue'
import ViewNotes from './views/ViewNotes.vue'
// import Search from './views/Search.vue'
// import ViewFlashcard from './views/ViewFlashcard.vue'
// import EditFlashcard from './views/EditFlashcard.vue'
// import EditNote from './views/EditNote.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Home',
    component: ViewHome
  },
  {
    path: '/flashcards/:id',
    name: 'ViewFlashcards',
    component: ViewFlashcards
  },
  {
    path: '/notes/:id',
    name: 'ViewNotes',
    component: ViewNotes
  }
  // {
  //   path: '/search',
  //   name: 'Search',
  //   component: Search
  // },
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
