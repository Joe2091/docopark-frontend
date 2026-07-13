<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getParkingSpots, getActiveSessions, checkIn, checkOut } from '@/api/parkingSpotsApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import type { ParkingSpot, ParkingSessionResponse } from '@/models/ParkingSpot'

const spots = ref<ParkingSpot[]>([])
const activeSessions = ref<ParkingSessionResponse[]>([])
const loading = ref(false)
const error = ref('')
const showCheckInForm = ref(false)
const showCheckOutForm = ref(false)

const checkInLicensePlate = ref('')
const checkOutLicensePlate = ref('')

const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [spotsData, sessionsData] = await Promise.all([getParkingSpots(), getActiveSessions()])
    spots.value = spotsData
    activeSessions.value = sessionsData
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load parking data'
  } finally {
    loading.value = false
  }
}

const handleCheckIn = async () => {
  try {
    await checkIn({ licensePlate: checkInLicensePlate.value })
    checkInLicensePlate.value = ''
    showCheckInForm.value = false
    await loadData()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to check in'
  }
}

const handleCheckOut = async () => {
  try {
    await checkOut({ licensePlate: checkOutLicensePlate.value })
    checkOutLicensePlate.value = ''
    showCheckOutForm.value = false
    await loadData()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to check out'
  }
}

onMounted(loadData)
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Parking Spots & Sessions</h1>

    <div class="d-flex gap-2 mb-4">
      <button class="btn btn-success" @click="showCheckInForm = !showCheckInForm">
        {{ showCheckInForm ? 'Cancel' : 'Check In' }}
      </button>
      <button class="btn btn-warning" @click="showCheckOutForm = !showCheckOutForm">
        {{ showCheckOutForm ? 'Cancel' : 'Check Out' }}
      </button>
    </div>

    <ErrorAlert v-if="error" :message="error" @close="error = ''" />

    <div v-if="showCheckInForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Check In</h5>
        <form @submit.prevent="handleCheckIn">
          <div class="mb-3">
            <label class="form-label">License Plate</label>
            <input v-model="checkInLicensePlate" type="text" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-success">Check In</button>
        </form>
      </div>
    </div>

    <div v-if="showCheckOutForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Check Out</h5>
        <form @submit.prevent="handleCheckOut">
          <div class="mb-3">
            <label class="form-label">License Plate</label>
            <input v-model="checkOutLicensePlate" type="text" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-warning">Check Out</button>
        </form>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-if="!loading" class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header">
            <h3>Parking Spots</h3>
          </div>
          <div class="card-body">
            <div class="table-responsive">
              <table class="table table-sm">
                <thead>
                  <tr>
                    <th>Spot Number</th>
                    <th>Status</th>
                    <th>Current Session</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="spot in spots" :key="spot.id">
                    <td>
                      <strong>{{ spot.spotNumber }}</strong>
                    </td>
                    <td>
                      <StatusBadge :status="spot.status" />
                    </td>
                    <td>{{ spot.currentSessionId || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3>Active Sessions ({{ activeSessions.length }})</h3>
          </div>
          <div class="card-body">
            <div v-if="activeSessions.length === 0" class="text-muted">
              No active parking sessions.
            </div>
            <ul v-else class="list-group">
              <li v-for="session in activeSessions" :key="session.id" class="list-group-item">
                <strong>{{ session.licensePlate }}</strong> - Spot {{ session.spotNumber }}
                <br />
                <small class="text-muted">
                  Check-in: {{ new Date(session.checkInTime).toLocaleString() }}
                </small>
                <br />
                <small>
                  <span :class="session.isPaid ? 'badge bg-success' : 'badge bg-warning'">
                    {{ session.isPaid ? 'Paid' : 'Unpaid' }}
                  </span>
                  Cost: ${{ session.totalCost.toFixed(2) }}
                </small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
