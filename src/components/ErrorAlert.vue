<script setup lang="ts">
defineProps<{
  message: string
}>()

defineEmits<{
  close: []
}>()
</script>

<template>
  <div class="alert alert-danger alert-dismissible fade show" role="alert">
    {{ message }}
    <button type="button" class="btn-close" @click="$emit('close')"></button>
  </div>
</template>
