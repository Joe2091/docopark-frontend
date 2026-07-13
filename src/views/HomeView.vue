<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getParkingSpotSummary } from '@/api/parkingSpotsApi'
import { getUsers } from '@/api/usersApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import type { ParkingSpotSummary } from '@/models/ParkingSpot'

const loading = ref(false)
const error = ref('')
const spotSummary = ref<ParkingSpotSummary | null>(null)
const userCount = ref(0)

onMounted(async () => {
  loading.value = true
  try {
    const [summary, users] = await Promise.all([getParkingSpotSummary(), getUsers()])
    spotSummary.value = summary
    userCount.value = users.length
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load dashboard data'
  } finally {
    loading.value = false
  }
})
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">DocoPark Dashboard</h1>

    <LoadingSpinner v-if="loading" />
    <ErrorAlert v-if="error" :message="error" @close="error = ''" />

    <div v-if="!loading && !error" class="row g-4">
      <div class="col-md-3">
        <div class="card text-white bg-primary">
          <div class="card-body">
            <h5 class="card-title">Total Spots</h5>
            <p class="card-text display-4">{{ spotSummary?.total || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-white bg-success">
          <div class="card-body">
            <h5 class="card-title">Available</h5>
            <p class="card-text display-4">{{ spotSummary?.available || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-white bg-danger">
          <div class="card-body">
            <h5 class="card-title">Occupied</h5>
            <p class="card-text display-4">{{ spotSummary?.occupied || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-3">
        <div class="card text-white bg-info">
          <div class="card-body">
            <h5 class="card-title">Reserved</h5>
            <p class="card-text display-4">{{ spotSummary?.reserved || 0 }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-12">
        <div class="card">
          <div class="card-body">
            <h5 class="card-title">System Overview</h5>
            <p class="card-text">
              Total Registered Users: <strong>{{ userCount }}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
