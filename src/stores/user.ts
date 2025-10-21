import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { UserAuthAPI } from '../api/concepts/UserAuthAPI.ts'

const TOKEN_KEY = 'auth_token'
const USER_ID_KEY = 'user_id'
const USERNAME_KEY = 'username' // Add this

export const useUserStore = defineStore('user', () => {
  // State
  const userId = ref<string | null>(null)
  const token = ref<string | null>(null)
  const username = ref<string | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // Computed
  const isAuthenticated = computed(() => !!token.value && !!userId.value)

  // Initialize from localStorage
  function init() {
    const savedToken = localStorage.getItem(TOKEN_KEY)
    const savedUserId = localStorage.getItem(USER_ID_KEY)
    const savedUsername = localStorage.getItem(USERNAME_KEY) // Add this
    
    if (savedToken && savedUserId) {
      token.value = savedToken
      userId.value = savedUserId
      username.value = savedUsername // Add this
      // Optionally verify the token is still valid
      verifyToken()
    }
  }

  // Verify token is still valid
  async function verifyToken() {
    if (!token.value) return false
    
    const result = await UserAuthAPI.getAuthenticatedUser({ token: token.value })
    if (result.error || !result.data) {
      clearAuth()
      return false
    }
    
    userId.value = result.data.user
    localStorage.setItem(USER_ID_KEY, result.data.user)
    return true
  }

  // Register a new user
  async function register(usernameInput: string, password: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await UserAuthAPI.register({ username: usernameInput, password })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      if (result.data) {
        token.value = result.data.token
        userId.value = result.data.user
        username.value = usernameInput
        
        // Persist to localStorage
        localStorage.setItem(TOKEN_KEY, result.data.token)
        localStorage.setItem(USER_ID_KEY, result.data.user)
        localStorage.setItem(USERNAME_KEY, usernameInput) // Add this
        
        return true
      }
      
      return false
    } catch (_e) {
      error.value = 'Registration failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Login an existing user
  async function login(usernameInput: string, password: string) {
    isLoading.value = true
    error.value = null
    
    try {
      const result = await UserAuthAPI.login({ username: usernameInput, password })
      
      if (result.error) {
        error.value = result.error
        return false
      }
      
      if (result.data) {
        token.value = result.data.token
        username.value = usernameInput
        
        // Get the user ID from the token
        const userResult = await UserAuthAPI.getAuthenticatedUser({ token: result.data.token })
        
        if (userResult.error || !userResult.data) {
          error.value = 'Failed to authenticate'
          return false
        }
        
        userId.value = userResult.data.user
        
        // Persist to localStorage
        localStorage.setItem(TOKEN_KEY, result.data.token)
        localStorage.setItem(USER_ID_KEY, userResult.data.user)
        localStorage.setItem(USERNAME_KEY, usernameInput) // Add this
        
        return true
      }
      
      return false
    } catch (_e) {
      error.value = 'Login failed'
      return false
    } finally {
      isLoading.value = false
    }
  }

  // Logout the current user
  async function logout() {
    if (token.value) {
      await UserAuthAPI.logout({ token: token.value })
    }
    clearAuth()
  }

  // Clear authentication state
  function clearAuth() {
    token.value = null
    userId.value = null
    username.value = null
    error.value = null
    localStorage.removeItem(TOKEN_KEY)
    localStorage.removeItem(USER_ID_KEY)
    localStorage.removeItem(USERNAME_KEY) // Add this
  }

  return {
    // State
    userId,
    token,
    username,
    isLoading,
    error,
    isAuthenticated,
    
    // Actions
    init,
    verifyToken,
    register,
    login,
    logout,
    clearAuth
  }
})
