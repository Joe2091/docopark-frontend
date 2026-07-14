<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getUser } from '@/api/usersApi'
import { getVehiclesByUser } from '@/api/vehiclesApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import type { UserResponse } from '@/models/User'
import type { VehicleResponse } from '@/models/Vehicle'

const route = useRoute()
const router = useRouter()
const user = ref<UserResponse | null>(null)
const vehicles = ref<VehicleResponse[]>([])
const loading = ref(false)
const error = ref('')

const loadUserDetails = async () => {
  loading.value = true
  error.value = ''
  const userId = Number(route.params.id)
  try {
    const [userData, vehiclesData] = await Promise.all([getUser(userId), getVehiclesByUser(userId)])
    user.value = userData
    vehicles.value = vehiclesData
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load user details'
  } finally {
    loading.value = false
  }
}

onMounted(loadUserDetails)
</script>

<template>
  <div class="container mt-4">
    <button class="btn btn-secondary mb-4" @click="router.push('/users')">← Back to Users</button>

    <LoadingSpinner v-if="loading" />
    <ErrorAlert v-if="error" :message="error" @close="error = ''" />

    <div v-if="!loading && user" class="row">
      <div class="col-md-6">
        <div class="card mb-4">
          <div class="card-header">
            <h3>User Details</h3>
          </div>
          <div class="card-body">
            <p><strong>ID:</strong> {{ user.id }}</p>
            <p><strong>Name:</strong> {{ user.name }}</p>
            <p><strong>Email:</strong> {{ user.email }}</p>
            <p><strong>Phone:</strong> {{ user.phone }}</p>
            <p>
              <strong>Payment Plan:</strong>
              <span
                :class="{
                  'badge bg-secondary': user.subscriptionType === 0,
                  'badge bg-primary': user.subscriptionType === 1,
                  'badge bg-success': user.subscriptionType === 2,
                }"
              >
                {{
                  user.subscriptionType === 0
                    ? 'Hourly'
                    : user.subscriptionType === 1
                      ? 'Daily'
                      : 'Monthly'
                }}
              </span>
            </p>
            <p>
              <strong>Premium:</strong>
              <span :class="user.isPremium ? 'badge bg-success' : 'badge bg-secondary'">
                {{ user.isPremium ? 'Yes' : 'No' }}
              </span>
            </p>
            <p><strong>Created:</strong> {{ new Date(user.createdDate).toLocaleDateString() }}</p>
          </div>
        </div>
      </div>

      <div class="col-md-6">
        <div class="card">
          <div class="card-header">
            <h3>Vehicles ({{ vehicles.length }})</h3>
          </div>
          <div class="card-body">
            <div v-if="vehicles.length === 0" class="text-muted">
              No vehicles registered for this user.
            </div>
            <ul v-else class="list-group">
              <li v-for="vehicle in vehicles" :key="vehicle.id" class="list-group-item">
                <strong>{{ vehicle.licensePlate }}</strong> - {{ vehicle.color }}
                <br />
                <small class="text-muted">
                  Type:
                  {{
                    vehicle.vehicleType === 0
                      ? 'Car'
                      : vehicle.vehicleType === 1
                        ? 'Motorcycle'
                        : 'Truck'
                  }}
                </small>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
