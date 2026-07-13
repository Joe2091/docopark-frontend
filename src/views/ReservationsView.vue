<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getReservations, createReservation, cancelReservation } from '@/api/reservationsApi'
import { getUsers } from '@/api/usersApi'
import { getVehicles } from '@/api/vehiclesApi'
import { getAvailableSpots } from '@/api/parkingSpotsApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import type { ReservationResponse, CreateReservationRequest } from '@/models/Reservation'
import type { UserResponse } from '@/models/User'
import type { VehicleResponse } from '@/models/Vehicle'
import type { AvailableParkingSpot } from '@/models/ParkingSpot'

const reservations = ref<ReservationResponse[]>([])
const users = ref<UserResponse[]>([])
const vehicles = ref<VehicleResponse[]>([])
const availableSpots = ref<AvailableParkingSpot[]>([])
const loading = ref(false)
const error = ref('')
const showCreateForm = ref(false)

const newReservation = ref<CreateReservationRequest>({
  userId: 0,
  parkingSpotId: 0,
  vehicleId: 0,
  reservedFrom: '',
  reservedTo: '',
})

const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [reservationsData, usersData, vehiclesData, spotsData] = await Promise.all([
      getReservations(),
      getUsers(),
      getVehicles(),
      getAvailableSpots(),
    ])
    reservations.value = reservationsData
    users.value = usersData
    vehicles.value = vehiclesData
    availableSpots.value = spotsData
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
}

const handleCreateReservation = async () => {
  try {
    await createReservation(newReservation.value)
    showCreateForm.value = false
    newReservation.value = {
      userId: 0,
      parkingSpotId: 0,
      vehicleId: 0,
      reservedFrom: '',
      reservedTo: '',
    }
    await loadData()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to create reservation'
  }
}

const handleCancelReservation = async (id: number) => {
  if (confirm('Are you sure you want to cancel this reservation?')) {
    try {
      await cancelReservation(id)
      await loadData()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to cancel reservation'
    }
  }
}

const getReservationStatus = (status: number) => {
  switch (status) {
    case 0:
      return 'Pending'
    case 1:
      return 'Confirmed'
    case 2:
      return 'Cancelled'
    case 3:
      return 'Completed'
    default:
      return 'Unknown'
  }
}

const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return 'warning'
    case 1:
      return 'success'
    case 2:
      return 'danger'
    case 3:
      return 'secondary'
    default:
      return 'secondary'
  }
}

onMounted(loadData)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Reservations</h1>
      <button class="btn btn-primary" @click="showCreateForm = !showCreateForm">
        {{ showCreateForm ? 'Cancel' : 'New Reservation' }}
      </button>
    </div>

    <ErrorAlert v-if="error" :message="error" @close="error = ''" />

    <div v-if="showCreateForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Create Reservation</h5>
        <form @submit.prevent="handleCreateReservation">
          <div class="mb-3">
            <label class="form-label">User</label>
            <select v-model.number="newReservation.userId" class="form-select" required>
              <option value="0">Select User</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Vehicle</label>
            <select v-model.number="newReservation.vehicleId" class="form-select" required>
              <option value="0">Select Vehicle</option>
              <option v-for="vehicle in vehicles" :key="vehicle.id" :value="vehicle.id">
                {{ vehicle.licensePlate }} - {{ vehicle.color }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Parking Spot</label>
            <select v-model.number="newReservation.parkingSpotId" class="form-select" required>
              <option value="0">Select Spot</option>
              <option v-for="spot in availableSpots" :key="spot.id" :value="spot.id">
                {{ spot.spotNumber }}
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Reserved From</label>
            <input
              v-model="newReservation.reservedFrom"
              type="datetime-local"
              class="form-control"
              required
            />
          </div>
          <div class="mb-3">
            <label class="form-label">Reserved To</label>
            <input
              v-model="newReservation.reservedTo"
              type="datetime-local"
              class="form-control"
              required
            />
          </div>
          <button type="submit" class="btn btn-success">Create Reservation</button>
        </form>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-if="!loading" class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Spot</th>
            <th>License Plate</th>
            <th>Reserved From</th>
            <th>Reserved To</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reservation in reservations" :key="reservation.id">
            <td>{{ reservation.id }}</td>
            <td>
              <strong>{{ reservation.spotNumber }}</strong>
            </td>
            <td>{{ reservation.licensePlate }}</td>
            <td>{{ new Date(reservation.reservedFrom).toLocaleString() }}</td>
            <td>{{ new Date(reservation.reservedTo).toLocaleString() }}</td>
            <td>
              <span :class="`badge bg-${getStatusColor(reservation.status)}`">
                {{ getReservationStatus(reservation.status) }}
              </span>
            </td>
            <td>
              <button
                v-if="reservation.status !== 2"
                class="btn btn-sm btn-danger"
                @click="handleCancelReservation(reservation.id)"
              >
                Cancel
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
