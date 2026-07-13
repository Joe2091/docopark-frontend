<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getSubscriptions,
  getActiveSubscriptions,
  createSubscription,
  cancelSubscription,
} from '@/api/subscriptionsApi'
import { getUsers } from '@/api/usersApi'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorAlert from '@/components/ErrorAlert.vue'
import type { SubscriptionResponse, CreateSubscriptionRequest } from '@/models/Subscription'
import type { UserResponse } from '@/models/User'

const subscriptions = ref<SubscriptionResponse[]>([])
const users = ref<UserResponse[]>([])
const loading = ref(false)
const error = ref('')
const showCreateForm = ref(false)
const showActiveOnly = ref(false)

const newSubscription = ref<CreateSubscriptionRequest>({
  userId: 0,
  type: 0,
  startDate: '',
})

const loadData = async () => {
  loading.value = true
  error.value = ''
  try {
    const [subscriptionsData, usersData] = await Promise.all([
      showActiveOnly.value ? getActiveSubscriptions() : getSubscriptions(),
      getUsers(),
    ])
    subscriptions.value = subscriptionsData
    users.value = usersData
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to load data'
  } finally {
    loading.value = false
  }
}

const handleCreateSubscription = async () => {
  try {
    await createSubscription(newSubscription.value)
    showCreateForm.value = false
    newSubscription.value = { userId: 0, type: 0, startDate: '' }
    await loadData()
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Failed to create subscription'
  }
}

const handleCancelSubscription = async (id: number) => {
  if (confirm('Are you sure you want to cancel this subscription?')) {
    try {
      await cancelSubscription(id)
      await loadData()
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Failed to cancel subscription'
    }
  }
}

const toggleActiveFilter = () => {
  showActiveOnly.value = !showActiveOnly.value
  loadData()
}

const getSubscriptionType = (type: number) => {
  switch (type) {
    case 0:
      return 'Basic'
    case 1:
      return 'Premium'
    case 2:
      return 'Enterprise'
    default:
      return 'Unknown'
  }
}

const getTypeColor = (type: number) => {
  switch (type) {
    case 0:
      return 'secondary'
    case 1:
      return 'primary'
    case 2:
      return 'success'
    default:
      return 'secondary'
  }
}

onMounted(loadData)
</script>

<template>
  <div class="container mt-4">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h1>Subscriptions</h1>
      <div class="d-flex gap-2">
        <button class="btn btn-outline-secondary" @click="toggleActiveFilter">
          {{ showActiveOnly ? 'Show All' : 'Active Only' }}
        </button>
        <button class="btn btn-primary" @click="showCreateForm = !showCreateForm">
          {{ showCreateForm ? 'Cancel' : 'New Subscription' }}
        </button>
      </div>
    </div>

    <ErrorAlert v-if="error" :message="error" @close="error = ''" />

    <div v-if="showCreateForm" class="card mb-4">
      <div class="card-body">
        <h5 class="card-title">Create Subscription</h5>
        <form @submit.prevent="handleCreateSubscription">
          <div class="mb-3">
            <label class="form-label">User</label>
            <select v-model.number="newSubscription.userId" class="form-select" required>
              <option value="0">Select User</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.name }} ({{ user.email }})
              </option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Subscription Type</label>
            <select v-model.number="newSubscription.type" class="form-select" required>
              <option :value="0">Basic</option>
              <option :value="1">Premium</option>
              <option :value="2">Enterprise</option>
            </select>
          </div>
          <div class="mb-3">
            <label class="form-label">Start Date</label>
            <input v-model="newSubscription.startDate" type="date" class="form-control" required />
          </div>
          <button type="submit" class="btn btn-success">Create Subscription</button>
        </form>
      </div>
    </div>

    <LoadingSpinner v-if="loading" />

    <div v-if="!loading" class="table-responsive">
      <table class="table table-striped table-hover">
        <thead>
          <tr>
            <th>ID</th>
            <th>User</th>
            <th>Type</th>
            <th>Start Date</th>
            <th>End Date</th>
            <th>Monthly Fee</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="subscription in subscriptions" :key="subscription.id">
            <td>{{ subscription.id }}</td>
            <td>{{ subscription.userName }}</td>
            <td>
              <span :class="`badge bg-${getTypeColor(subscription.type)}`">
                {{ getSubscriptionType(subscription.type) }}
              </span>
            </td>
            <td>{{ new Date(subscription.startDate).toLocaleDateString() }}</td>
            <td>
              {{
                subscription.endDate
                  ? new Date(subscription.endDate).toLocaleDateString()
                  : 'Active'
              }}
            </td>
            <td>${{ subscription.monthlyFee.toFixed(2) }}</td>
            <td>
              <span :class="subscription.isActive ? 'badge bg-success' : 'badge bg-secondary'">
                {{ subscription.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td>
              <button
                v-if="subscription.isActive"
                class="btn btn-sm btn-danger"
                @click="handleCancelSubscription(subscription.id)"
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
