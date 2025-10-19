<template>
  <div id="app">
    <nav class="navbar">
      <div class="nav-brand">
        <router-link to="/">TorahCards</router-link>
      </div>
      <div class="nav-links">
        <router-link to="/">Home</router-link>
        <router-link to="/search">Search</router-link>
      </div>
    </nav>
    
    <main class="main-content">
      <router-view />
    </main>
  </div>
</template>

<script setup lang="ts">
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

.main-content {
  padding: 20px;
}
</style>
