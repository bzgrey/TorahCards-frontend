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
/* Torah Scroll Color Palette */
:root {
  --bg-parchment: #F8F5E9;
  --accent-leather: #A67C52;
  --text-charcoal: #2E2E2E;
  --highlight-subtle: #BAB9A1;
  --border-gold: #CBBF7A;
  
  /* Typography Colors */
  --text-heading: #2B2B2B;
  --text-body: #2F2F2F;
  --text-quote: #5A5A5A;
  
  /* Typography Fonts */
  --font-heading: 'EB Garamond', Georgia, serif;
  --font-body: 'Noto Sans', 'Open Sans', sans-serif;
  --font-hebrew: 'Noto Sans Hebrew', sans-serif;
  --font-ui: 'Noto Sans', sans-serif;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

#app {
  font-family: var(--font-body);
  min-height: 100vh;
  background: var(--bg-parchment);
  color: var(--text-body);
  line-height: 1.6;
  font-weight: 400;
}

/* Typography System */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-heading);
  color: var(--text-heading);
  font-weight: 600;
  line-height: 1.3;
  letter-spacing: -0.3px;
}

h1 {
  font-size: 2.5rem;
  font-weight: 700;
}

h2 {
  font-size: 2rem;
  font-weight: 600;
}

h3 {
  font-size: 1.5rem;
  font-weight: 600;
}

h4 {
  font-size: 1.25rem;
  font-weight: 500;
}

p {
  font-family: var(--font-body);
  color: var(--text-body);
  line-height: 1.6;
}

/* UI Elements Typography */
button, .btn {
  font-family: var(--font-ui);
  font-weight: 600;
  letter-spacing: -0.5px;
}

input, textarea, select {
  font-family: var(--font-body);
  color: var(--text-body);
}

label {
  font-family: var(--font-ui);
  font-weight: 600;
  color: var(--text-heading);
}

/* Quote/Italic Text */
.quote, blockquote, em {
  font-family: var(--font-heading);
  font-style: italic;
  color: var(--text-quote);
}

.navbar {
  background: var(--accent-leather);
  color: var(--bg-parchment);
  padding: 15px 30px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: 3px solid var(--border-gold);
}

.nav-brand a {
  font-family: var(--font-heading);
  font-size: 28px;
  font-weight: 700;
  color: var(--bg-parchment);
  text-decoration: none;
  text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.2);
  letter-spacing: -0.5px;
}

.nav-links {
  display: flex;
  gap: 20px;
  align-items: center;
}

.nav-links a {
  font-family: var(--font-ui);
  color: var(--bg-parchment);
  text-decoration: none;
  padding: 8px 16px;
  border-radius: 4px;
  transition: background 0.3s;
  font-weight: 600;
  letter-spacing: -0.3px;
  text-transform: uppercase;
  font-size: 0.85rem;
}

.nav-links a:hover,
.nav-links a.router-link-active {
  background: rgba(0, 0, 0, 0.2);
  border-bottom: 2px solid var(--border-gold);
}

.user-info {
  display: flex;
  align-items: center;
  gap: 15px;
  margin-left: 10px;
  padding-left: 20px;
  border-left: 2px solid var(--border-gold);
}

.username {
  font-family: var(--font-body);
  color: var(--bg-parchment);
  font-weight: 500;
}

.btn-logout {
  font-family: var(--font-ui);
  background: var(--highlight-subtle);
  color: var(--text-charcoal);
  border: 1px solid var(--border-gold);
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  transition: all 0.3s;
  text-transform: uppercase;
  letter-spacing: -0.5px;
}

.btn-logout:hover {
  background: var(--border-gold);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
}

.main-content {
  padding: 20px;
}
</style>
