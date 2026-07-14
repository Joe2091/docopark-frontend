<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { getParkingSpots, getActiveSessions, checkIn, checkOut } from '@/api/parkingSpotsApi'
import { getVehicles } from '@/api/vehiclesApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import StatusBadge from '@/components/StatusBadge.vue'
import type { ParkingSpot, ParkingSessionResponse } from '@/models/ParkingSpot'
import type { VehicleResponse } from '@/models/Vehicle'

const spots = ref<ParkingSpot[]>([])
const activeSessions = ref<ParkingSessionResponse[]>([])
const vehicles = ref<VehicleResponse[]>([])
const loading = ref(false)
const error = ref('')
const showCheckInForm = ref(false)
const showCheckOutForm = ref(false)

const checkInLicensePlate = ref('')
const checkOutLicensePlate = ref('')

// Vehicles available for check-in (not currently in a session)
const availableVehicles = computed(() => {
  const activePlates = activeSessions.value.map((s) => s.licensePlate.toLowerCase())
  return vehicles.value.filter((v) => !activePlates.includes(v.licensePlate.toLowerCase()))
})

// Vehicles currently checked in (can check out)
const checkedInVehicles = computed(() => {
  const activePlates = new Set(activeSessions.value.map((s) => s.licensePlate.toLowerCase()))
  return vehicles.value.filter((v) => activePlates.has(v.licensePlate.toLowerCase()))
})

const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [spotsData, sessionsData, vehiclesData] = await Promise.all([
      getParkingSpots(),
      getActiveSessions(),
      getVehicles(),
    ])
    spots.value = spotsData
    activeSessions.value = sessionsData
    vehicles.value = vehiclesData
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load parking data'
  } finally {
    loading.value = false
  }
}

const handleCheckIn = async () => {
  if (!checkInLicensePlate.value) {
    error.value = 'Please select a vehicle'
    return
  }
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
  if (!checkOutLicensePlate.value) {
    error.value = 'Please select a vehicle'
    return
  }
  try {
    await checkOut({ licensePlate: checkOutLicensePlate.value })
    checkOutLicensePlate.value = ''
    showCheckOutForm.value = false
    await loadData()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to check out'
  }
}

const getDuration = (checkInTime: string) => {
  const start = new Date(checkInTime)
  const now = new Date()
  const diffMs = now.getTime() - start.getTime()
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60))
  return { hours, minutes, text: `${hours}h ${minutes}m` }
}

const getExpectedHourlyCost = (checkInTime: string) => {
  const duration = getDuration(checkInTime)
  const totalHours = Math.ceil(duration.hours + duration.minutes / 60)
  // Hourly rate: $3/hour, capped at $10/day
  return Math.min(totalHours * 3, 10)
}

onMounted(loadData)
</script>

<template>
  <div class="container mt-4">
    <h1 class="mb-4">Parking Spots & Sessions</h1>

    <!-- Pricing Reference Card -->
    <div class="card mb-4 border-info">
      <div class="card-body bg-light">
        <h6 class="card-title mb-3">💰 Pricing Rates</h6>
        <div class="row">
          <div class="col-md-4">
            <strong>Hourly:</strong> $3/hour<br />
            <small class="text-muted">Daily cap: $10</small>
          </div>
          <div class="col-md-4">
            <strong>Daily:</strong> $10/day<br />
            <small class="text-muted">Fixed daily rate</small>
          </div>
          <div class="col-md-4">
            <strong>Monthly:</strong> $150/month<br />
            <small class="text-muted">Premium members</small>
          </div>
        </div>
      </div>
    </div>

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
        <h5 class="card-title">Check In Vehicle</h5>
        <form @submit.prevent="handleCheckIn">
          <div class="mb-3">
            <label class="form-label">Select Vehicle</label>
            <select v-model="checkInLicensePlate" class="form-select" required>
              <option value="">-- Choose a vehicle --</option>
              <option
                v-for="vehicle in availableVehicles"
                :key="vehicle.id"
                :value="vehicle.licensePlate"
              >
                {{ vehicle.licensePlate }} - {{ vehicle.color }} ({{
                  vehicle.ownerName || 'No Owner'
                }})
              </option>
            </select>
            <small v-if="availableVehicles.length === 0" class="text-muted">
              No vehicles available for check-in. All registered vehicles are currently parked.
            </small>
          </div>
          <button type="submit" class="btn btn-success" :disabled="!checkInLicensePlate">
            Check In
          </button>
        </form>
      </div>
    </div>

    <div v-if="showCheckOutForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Check Out Vehicle</h5>
        <form @submit.prevent="handleCheckOut">
          <div class="mb-3">
            <label class="form-label">Select Vehicle</label>
            <select v-model="checkOutLicensePlate" class="form-select" required>
              <option value="">-- Choose a vehicle --</option>
              <option
                v-for="vehicle in checkedInVehicles"
                :key="vehicle.id"
                :value="vehicle.licensePlate"
              >
                {{ vehicle.licensePlate }} - {{ vehicle.color }} ({{
                  vehicle.ownerName || 'No Owner'
                }})
              </option>
            </select>
            <small v-if="checkedInVehicles.length === 0" class="text-muted">
              No vehicles currently checked in.
            </small>
          </div>
          <button type="submit" class="btn btn-warning" :disabled="!checkOutLicensePlate">
            Check Out
          </button>
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
          <div class="card-header d-flex justify-content-between align-items-center">
            <h3>Active Sessions ({{ activeSessions.length }})</h3>
            <small class="text-muted">Hourly: $3/hr (cap $10/day)</small>
          </div>
          <div class="card-body">
            <div v-if="activeSessions.length === 0" class="text-muted">
              No active parking sessions.
            </div>
            <div v-else class="list-group">
              <div v-for="session in activeSessions" :key="session.id" class="list-group-item">
                <div class="d-flex justify-content-between align-items-start">
                  <div class="flex-grow-1">
                    <h6 class="mb-1">
                      <strong>{{ session.licensePlate }}</strong>
                      <span class="text-muted ms-2">Spot {{ session.spotNumber }}</span>
                    </h6>
                    <div class="mb-2">
                      <small class="text-muted d-block">
                        ⏰ Check-in: {{ new Date(session.checkInTime).toLocaleString() }}
                      </small>
                      <small class="text-muted d-block">
                        ⏱️ Duration: {{ getDuration(session.checkInTime).text }}
                      </small>
                    </div>
                  </div>
                  <div class="text-end">
                    <div class="mb-2">
                      <span :class="session.isPaid ? 'badge bg-success' : 'badge bg-warning'">
                        {{ session.isPaid ? 'Paid' : 'Unpaid' }}
                      </span>
                    </div>
                    <div class="mb-1">
                      <strong style="font-size: 1.1rem">${{ session.totalCost.toFixed(2) }}</strong>
                      <br />
                      <small class="text-muted">Backend Cost</small>
                    </div>
                    <div class="pt-1 border-top">
                      <small class="text-info">
                        Expected: ${{ getExpectedHourlyCost(session.checkInTime).toFixed(2) }}
                      </small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
