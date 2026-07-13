<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getVehicles, createVehicle, deleteVehicle } from '@/api/vehiclesApi'
import { getUsers } from '@/api/usersApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import type { VehicleResponse, CreateVehicleRequest } from '@/models/Vehicle'
import type { UserResponse } from '@/models/User'

const vehicles = ref<VehicleResponse[]>([])
const users = ref<UserResponse[]>([])
const loading = ref(false)
const error = ref('')
const showCreateForm = ref(false)

const newVehicle = ref<CreateVehicleRequest>({
  licensePlate: '',
  color: '',
  vehicleType: 0,
  userId: null,
})

const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [vehiclesData, usersData] = await Promise.all([getVehicles(), getUsers()])
    vehicles.value = vehiclesData
    users.value = usersData
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
}

const handleCreateVehicle = async () => {
  try {
    await createVehicle(newVehicle.value)
    showCreateForm.value = false
    newVehicle.value = { licensePlate: '', color: '', vehicleType: 0, userId: null }
    await loadData()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to create vehicle'
  }
}

const handleDeleteVehicle = async (id: number) => {
  if (confirm('Are you sure you want to delete this vehicle?')) {
    try {
      await deleteVehicle(id)
      await loadData()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to delete vehicle'
    }
  }
}

onMounted(loadData)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Vehicle Management</h1>
      <button class="btn btn-primary" @click="showCreateForm = !showCreateForm">
        {{ showCreateForm ? 'Cancel' : 'Add Vehicle' }}
      </button>
    </div>

    <ErrorAlert v-if="error" :message="error" @close="error = ''" />

    <div v-if="showCreateForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Register New Vehicle</h5>
        <form @submit.prevent="handleCreateVehicle">
          <div class="mb-3">
            <label class="form-label">License Plate</label>
            <input v-model="newVehicle.licensePlate" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Color</label>
            <input v-model="newVehicle.color" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Vehicle Type</label>
            <select v-model.number="newVehicle.vehicleType" class="form-select" required>
              <option :value="0">Car</option>
              <option :value="1">Motorcycle</option>
              <option :value="2">Truck</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Owner (Optional)</label>
            <select v-model.number="newVehicle.userId" class="form-select">
              <option :value="null">No Owner</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>
          <button type="submit" class="btn btn-success">Register Vehicle</button>
        </form>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-if="!loading" class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>License Plate</th>
            <th>Color</th>
            <th>Type</th>
            <th>Owner</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="vehicle in vehicles" :key="vehicle.id">
            <td>{{ vehicle.id }}</td>
            <td>
              <strong>{{ vehicle.licensePlate }}</strong>
            </td>
            <td>{{ vehicle.color }}</td>
            <td>
              <span
                :class="{
                  'badge bg-primary': vehicle.vehicleType === 0,
                  'badge bg-warning': vehicle.vehicleType === 1,
                  'badge bg-info': vehicle.vehicleType === 2,
                }"
              >
                {{
                  vehicle.vehicleType === 0
                    ? 'Car'
                    : vehicle.vehicleType === 1
                      ? 'Motorcycle'
                      : 'Truck'
                }}
              </span>
            </td>
            <td>{{ vehicle.ownerName || 'No Owner' }}</td>
            <td>
              <button class="btn btn-sm btn-danger" @click="handleDeleteVehicle(vehicle.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
