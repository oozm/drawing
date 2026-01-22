<script setup lang="ts">
import ComponentCard from '@/components/ComponentCard.vue'

const { user, clear } = useUserSession()
const { $api } = useNuxtApp()

// Fetch user's components
const { data: myComponents, pending } = await useAsyncData(
  'my-components',
  () => $api('/api/components/elements', {
    params: {
      _data: 'routes/$category', // Required by the API validation
      scope: 'mine',
    },
  }),
)

const components = computed(() => (myComponents.value as any)?.components || [])

const handleLogout = async () => {
  await clear()
  navigateTo('/')
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
    <UContainer>
      <!-- Profile Header -->
      <div class="flex flex-col items-center justify-center mb-12">
        <UAvatar
          :src="user?.avatar"
          :alt="user?.name"
          size="3xl"
          class="mb-4"
        />
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {{ user?.name }}
        </h1>

        <UButton
          color="neutral"
          variant="ghost"
          icon="i-heroicons-arrow-right-on-rectangle"
          label="Sign out"
          @click="handleLogout"
        />
      </div>

      <!-- My Contributions -->
      <div class="space-y-6">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-800 pb-4">
          My Contributions
        </h2>

        <div
          v-if="pending"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <div
            v-for="i in 3"
            :key="i"
            class="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-xl"
          />
        </div>

        <div
          v-else-if="components.length > 0"
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <ComponentCard
            v-for="comp in components"
            :key="comp.id"
            :component="comp"
          />
        </div>

        <div
          v-else
          class="text-center py-12 text-gray-500 dark:text-gray-400"
        >
          <UIcon
            name="i-heroicons-cube-transparent"
            class="w-12 h-12 mx-auto mb-4 opacity-50"
          />
          <p>You haven't published any components yet.</p>
          <UButton
            to="/create"
            class="mt-4"
            color="primary"
            variant="soft"
            label="Create your first component"
          />
        </div>
      </div>
    </UContainer>
  </div>
</template>
