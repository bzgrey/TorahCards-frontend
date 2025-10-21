<template>
  <div class="auth-container">
    <div class="auth-card">
      <h1>{{ isLogin ? 'Login' : 'Register' }}</h1>
      
      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="username">Username</label>
          <input
            id="username"
            v-model="username"
            type="text"
            required
            placeholder="Enter your username"
            :disabled="userStore.isLoading"
          />
        </div>
        
        <div class="form-group">
          <label for="password">Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Enter your password"
            :disabled="userStore.isLoading"
          />
        </div>
        
        <div v-if="!isLogin" class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            required
            placeholder="Confirm your password"
            :disabled="userStore.isLoading"
          />
        </div>
        
        <div v-if="userStore.error" class="error-message">
          {{ userStore.error }}
        </div>
        
        <div v-if="localError" class="error-message">
          {{ localError }}
        </div>
        
        <button 
          type="submit" 
          class="btn-primary"
          :disabled="userStore.isLoading"
        >
          {{ userStore.isLoading ? 'Loading...' : (isLogin ? 'Login' : 'Register') }}
        </button>
      </form>
      
      <div class="auth-toggle">
        <p>
          {{ isLogin ? "Don't have an account?" : "Already have an account?" }}
          <button @click="toggleMode" class="btn-link" :disabled="userStore.isLoading">
            {{ isLogin ? 'Register' : 'Login' }}
          </button>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.ts'

const router = useRouter()
const userStore = useUserStore()

const isLogin = ref(true)
const username = ref('')
const password = ref('')
const confirmPassword = ref('')
const localError = ref<string | null>(null)

function toggleMode() {
  isLogin.value = !isLogin.value
  localError.value = null
  userStore.error = null
  password.value = ''
  confirmPassword.value = ''
}

async function handleSubmit() {
  localError.value = null
  
  if (!isLogin.value && password.value !== confirmPassword.value) {
    localError.value = 'Passwords do not match'
    return
  }
  
  let success = false
  
  if (isLogin.value) {
    success = await userStore.login(username.value, password.value)
  } else {
    success = await userStore.register(username.value, password.value)
  }
  
  if (success) {
    // Redirect to home page after successful login/register
    router.push('/')
  }
}
</script>

<style scoped>
.auth-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px);
  padding: 20px;
}

.auth-card {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  width: 100%;
  max-width: 400px;
}

.auth-card h1 {
  text-align: center;
  margin-bottom: 30px;
  color: #333;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-group label {
  font-weight: 600;
  color: #555;
}

.form-group input {
  padding: 12px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 16px;
  transition: border-color 0.3s;
}

.form-group input:focus {
  outline: none;
  border-color: #007bff;
}

.form-group input:disabled {
  background-color: #f5f5f5;
  cursor: not-allowed;
}

.error-message {
  background: #fee;
  color: #c33;
  padding: 10px;
  border-radius: 4px;
  font-size: 14px;
  text-align: center;
}

.btn-primary {
  padding: 12px;
  background: #007bff;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.3s;
}

.btn-primary:hover:not(:disabled) {
  background: #0056b3;
}

.btn-primary:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.auth-toggle {
  margin-top: 20px;
  text-align: center;
}

.auth-toggle p {
  color: #666;
}

.btn-link {
  background: none;
  border: none;
  color: #007bff;
  cursor: pointer;
  font-size: 16px;
  text-decoration: underline;
  padding: 0;
  margin-left: 5px;
}

.btn-link:hover:not(:disabled) {
  color: #0056b3;
}

.btn-link:disabled {
  color: #ccc;
  cursor: not-allowed;
}
</style>
