import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import ViewFlashcards from './views/ViewFlashcards.vue'
import DemoFlashcards from './views/DemoFlashcards.vue'
// import Home from './views/Home.vue'
// import Search from './views/Search.vue'
// import ViewFlashcard from './views/ViewFlashcard.vue'
// import ViewNote from './views/ViewNote.vue'
// import EditFlashcard from './views/EditFlashcard.vue'
// import EditNote from './views/EditNote.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Demo',
    component: DemoFlashcards
  },
  {
    path: '/flashcards/:id',
    name: 'ViewFlashcards',
    component: ViewFlashcards
  }
  // {
  //   path: '/',
  //   name: 'Home',
  //   component: Home
  // },
  // {
  //   path: '/search',
  //   name: 'Search',
  //   component: Search
  // },
  // {
  //   path: '/flashcard/:id',
  //   name: 'ViewFlashcard',
  //   component: ViewFlashcard
  // },
  // {
  //   path: '/note/:id',
  //   name: 'ViewNote',
  //   component: ViewNote
  // },
  // {
  //   path: '/flashcard/:id/edit',
  //   name: 'EditFlashcard',
  //   component: EditFlashcard
  // },
  // {
  //   path: '/note/:id/edit',
  //   name: 'EditNote',
  //   component: EditNote
  // }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
