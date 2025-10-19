import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { User } from '../api/types.ts'

export const useUserStore = defineStore('user', () => {
  // State
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // Actions
  function setUser(user: User) {
    currentUser.value = user
    isAuthenticated.value = true
  }

  function clearUser() {
    currentUser.value = null
    isAuthenticated.value = false
  }

  function logout() {
    clearUser()
  }

  return {
    // State
    currentUser,
    isAuthenticated,
    
    // Actions
    setUser,
    clearUser,
    logout
  }
})
