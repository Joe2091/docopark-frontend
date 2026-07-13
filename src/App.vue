<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import AppNavBar from './components/AppNavBar.vue'
</script>

<template>
  <div id="app">
    <AppNavBar />
    <RouterView />
  </div>
</template>

<style>
body {
  margin: 0;
  font-family:
    -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
}

#app {
  min-height: 100vh;
  background-color: #f8f9fa;
}
</style>
