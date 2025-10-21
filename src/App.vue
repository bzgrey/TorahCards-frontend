<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/">TorahCards</router-link>
      </div>
      <div class="nav-links">
        <template v-if="userStore.isAuthenticated">
          <router-link to="/">Home</router-link>
          <router-link to="/search">Search</router-link>
          <div class="user-info">
            <span class="username">{{ userStore.username || 'User' }}</span>
            <button @click="handleLogout" class="btn-logout">Logout</button>
          </div>
        </template>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useUserStore } from './stores/user.ts'

const router = useRouter()
const userStore = useUserStore()

// Initialize user store from localStorage on app mount
onMounted(() => {
  userStore.init()
})

async function handleLogout() {
  await userStore.logout()
  router.push('/auth')
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: Arial, sans-serif;
  min-height: 100vh;
}

.navbar {
  background: #333;
  color: white;
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.nav-brand a {
  font-size: 24px;
  font-weight: bold;
  color: white;
  text-decoration: none;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  color: white;
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.3s;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: #555;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 10px;
  padding-left: 20px;
  border-left: 1px solid #555;
}

.username {
  color: white;
  font-weight: 500;
}

.btn-logout {
  background: #dc3545;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  transition: background 0.3s;
}

.btn-logout:hover {
  background: #c82333;
}

.main-content {
  padding: 20px;
}
</style>
