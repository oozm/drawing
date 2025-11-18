<template>
  <div>
    <h1>Test</h1>
    <p>{{ data?.message }}</p>
  </div>
</template>

<script setup lang="ts">
const { data } = await useFetch<{ message: string }>('/api/test', {
  method: 'GET',
})
</script>
