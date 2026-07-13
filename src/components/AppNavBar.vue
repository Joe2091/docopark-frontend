<script setup lang="ts">
import { RouterLink } from 'vue-router'
</script>

<template>
  <nav class="navbar navbar-expand-lg navbar-dark bg-primary">
    <div class="container-fluid">
      <RouterLink to="/" class="navbar-brand">🚗 DocoPark</RouterLink>
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav">
          <li class="nav-item">
            <RouterLink to="/" class="nav-link">Home</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/users" class="nav-link">Users</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/vehicles" class="nav-link">Vehicles</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/parking-spots" class="nav-link">Parking</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/reservations" class="nav-link">Reservations</RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/subscriptions" class="nav-link">Subscriptions</RouterLink>
          </li>
        </ul>
      </div>
    </div>
  </nav>
</template>

<style scoped>
.nav-link.router-link-active {
  font-weight: bold;
  color: #fff !important;
}
</style>
