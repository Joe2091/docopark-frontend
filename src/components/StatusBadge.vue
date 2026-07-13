<script setup lang="ts">
defineProps<{
  status: string
}>()

const getBadgeColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'available':
      return 'success'
    case 'occupied':
      return 'danger'
    case 'reserved':
      return 'warning'
    case 'active':
      return 'success'
    case 'inactive':
      return 'secondary'
    default:
      return 'secondary'
  }
}
</script>

<template>
  <span :class="`badge bg-${getBadgeColor(status)}`">
    {{ status }}
  </span>
</template>
