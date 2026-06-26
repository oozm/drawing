<script setup lang="ts">
defineProps<{
  tags: string[]
  currentTag?: string | null
}>()

const emit = defineEmits<{
  change: [tag: string | null]
}>()
</script>

<template>
  <div class="flex flex-wrap gap-2">
    <button
      type="button"
      class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
      :class="!currentTag
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
        : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'"
      @click="emit('change', null)"
    >
      全部
    </button>
    <button
      v-for="tag in tags"
      :key="tag"
      type="button"
      class="rounded-full px-4 py-2 text-sm font-medium transition-all duration-200"
      :class="currentTag === tag
        ? 'bg-blue-600 text-white shadow-md shadow-blue-600/25'
        : 'bg-neutral-800/80 text-neutral-400 hover:bg-neutral-700 hover:text-neutral-200'"
      @click="emit('change', tag)"
    >
      {{ tag }}
    </button>
  </div>
</template>
