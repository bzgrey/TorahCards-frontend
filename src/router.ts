import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useUserStore } from './stores/user.ts'
import ViewHome from './views/ViewHome.vue'
import ViewFlashcards from './views/ViewFlashcards.vue'
import ViewNotes from './views/ViewNotes.vue'
import ViewAuth from './views/ViewAuth.vue'
// import Search from './views/Search.vue'
// import ViewFlashcard from './views/ViewFlashcard.vue'
// import EditFlashcard from './views/EditFlashcard.vue'
// import EditNote from './views/EditNote.vue'

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    name: 'Auth',
    component: ViewAuth,
    meta: { requiresGuest: true }
  },
  {
    path: '/',
    name: 'Home',
    component: ViewHome,
    meta: { requiresAuth: true }
  },
  {
    path: '/flashcards/:id',
    name: 'ViewFlashcards',
    component: ViewFlashcards,
    meta: { requiresAuth: true }
  },
  {
    path: '/notes/:id',
    name: 'ViewNotes',
    component: ViewNotes,
    meta: { requiresAuth: true }
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

// Navigation guard for authentication
router.beforeEach((to, _from, next) => {
  const userStore = useUserStore()
  
  // Check if route requires authentication
  if (to.meta.requiresAuth && !userStore.isAuthenticated) {
    // Redirect to auth page if not authenticated
    next({ name: 'Auth' })
  } 
  // Check if route is for guests only (like login page)
  else if (to.meta.requiresGuest && userStore.isAuthenticated) {
    // Redirect to home if already authenticated
    next({ name: 'Home' })
  } 
  else {
    // Proceed to route
    next()
  }
})

export default router
