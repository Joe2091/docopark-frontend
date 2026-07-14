<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { getUsers, createUser, deleteUser } from '@/api/usersApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import type { UserResponse, CreateUserRequest } from '@/models/User'

const router = useRouter()
const users = ref<UserResponse[]>([])
const loading = ref(false)
const error = ref('')
const showCreateForm = ref(false)

const newUser = ref<CreateUserRequest>({
  name: '',
  email: '',
  phone: '',
  subscriptionType: 0,
})

const loadUsers = async () => {
  loading.value = true
  error.value = ''
  try {
    users.value = await getUsers()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load users'
  } finally {
    loading.value = false
  }
}

const handleCreateUser = async () => {
  try {
    await createUser(newUser.value)
    showCreateForm.value = false
    newUser.value = { name: '', email: '', phone: '', subscriptionType: 0 }
    await loadUsers()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to create user'
  }
}

const handleDeleteUser = async (id: number) => {
  if (confirm('Are you sure you want to delete this user?')) {
    try {
      await deleteUser(id)
      await loadUsers()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to delete user'
    }
  }
}

const viewUserDetails = (id: number) => {
  router.push(`/users/${id}`)
}

onMounted(loadUsers)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>User Management</h1>
      <button class="btn btn-primary" @click="showCreateForm = !showCreateForm">
        {{ showCreateForm ? 'Cancel' : 'Add User' }}
      </button>
    </div>

    <ErrorAlert v-if="error" :message="error" @close="error = ''" />

    <div v-if="showCreateForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Create New User</h5>
        <form @submit.prevent="handleCreateUser">
          <div class="mb-3">
            <label class="form-label">Name</label>
            <input v-model="newUser.name" type="text" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Email</label>
            <input v-model="newUser.email" type="email" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Phone</label>
            <input v-model="newUser.phone" type="tel" class="form-control" required />
          </div>
          <div class="mb-3">
            <label class="form-label">Payment Plan</label>
            <select v-model.number="newUser.subscriptionType" class="form-select" required>
              <option :value="0">Hourly - Pay-as-you-go ($3/hr, cap $10/day)</option>
              <option :value="1">Daily - Pay-as-you-go ($10/day)</option>
              <option :value="2">Monthly Subscription - Premium ($150/month)</option>
            </select>
          </div>
          <button type="submit" class="btn btn-success">Create User</button>
        </form>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-if="!loading" class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Payment Plan</th>
            <th>Premium</th>
            <th>Vehicles</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.id }}</td>
            <td>{{ user.name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.phone }}</td>
            <td>
              <span
                :class="{
                  'badge bg-secondary': user.subscriptionType === 0,
                  'badge bg-primary': user.subscriptionType === 1,
                  'badge bg-success': user.subscriptionType === 2,
                }"
              >
                {{
                  user.subscriptionType === 0
                    ? 'Basic'
                    : user.subscriptionType === 1
                      ? 'Premium'
                      : 'Enterprise'
                }}
              </span>
            </td>
            <td>
              <span :class="user.isPremium ? 'badge bg-success' : 'badge bg-secondary'">
                {{ user.isPremium ? 'Yes' : 'No' }}
              </span>
            </td>
            <td>{{ user.vehicleCount }}</td>
            <td>
              <button class="btn btn-sm btn-info me-2" @click="viewUserDetails(user.id)">
                View
              </button>
              <button class="btn btn-sm btn-danger" @click="handleDeleteUser(user.id)">
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
