<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
// 正常项目结构中，我们需要导入局部组件
import ComponentCard from './ComponentCard.vue'
// 假设这里可以使用 Nuxt 提供的 useColorMode

// --- Type Definitions ---
const COMPONENT_TYPES = [
  'Button', 'Input', 'Select', 'Card', 'Modal', 'Navigation', 'Layout', 'Other',
]

// --- Theme Logic ---
// 使用 Nuxt 的 useColorMode (需要 Nuxt 环境)
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.preference === 'dark'
  },
  set(val: boolean) {
    colorMode.preference = val ? 'dark' : 'light'
  },
})

// --- Reactive State ---
const components = ref<any[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const nextCursor = ref<string | null>(null)
const hasMore = ref(true)
const currentType = ref<string | null>(null)

// UI state
const searchTerm = ref('')
const viewMode = ref('grid') // 控制网格/列表视图
const limit = 20

// --- Utility Functions ---

/**
 * Fetch function with exponential backoff for retries.
 */
const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response
    }
    catch (e) {
      if (i === retries - 1) {
        console.error('Fetch failed after all retries:', e)
        throw e
      }
      // Exponential backoff (1s, 2s, 4s, ...)
      const delay = Math.pow(2, i) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Exceeded max retries.')
}

// --- Data Fetching Logic ---

/**
 * Main data fetching logic using /api/components/list endpoint.
 * @param {boolean} reset - Whether to reset the component list.
 * @param {string | null} cursor - Pagination cursor.
 */
const fetchComponents = async (reset = false, cursor: string | null = null) => {
  loading.value = true
  error.value = null

  // Build query parameters
  const queryParams = new URLSearchParams()
  if (cursor) {
    queryParams.append('cursor', cursor)
  }
  if (currentType.value) {
    queryParams.append('type', currentType.value)
  }
  queryParams.append('limit', limit.toString())

  const url = `/api/components/list?${queryParams.toString()}`

  try {
    const response = await fetchWithRetry(url)
    const data = await response.json()

    const newComponents = Array.isArray(data.components) ? data.components : []

    // Update component list
    components.value = reset ? newComponents : [...components.value, ...newComponents]
    nextCursor.value = data.nextCursor || null
    hasMore.value = data.hasMore ?? false
  }
  catch (err) {
    console.error('Failed to fetch components:', err)
    error.value = 'Component failed to load. Please try again later or check API connectivity.'
  }
  finally {
    loading.value = false
  }
}

// --- Lifecycle Hooks and Watchers ---

onMounted(() => {
  // 确保 Web Component 类已注册 (ComponentPreview.js 应该已被导入)
  fetchComponents(true, null)
})

// Watch currentType changes to trigger reload
watch(currentType, () => {
  fetchComponents(true, null)
})

// Handle load more button click
const handleLoadMore = () => {
  if (nextCursor.value && !loading.value) {
    fetchComponents(false, nextCursor.value)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
    <UContainer
      as="header"
      class="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4 flex flex-col sm:flex-row items-center justify-between sticky top-0 z-20 shadow-xl"
    >
      <div class="flex items-center space-x-4 mb-3 sm:mb-0 w-full sm:w-auto">
        <h1 class="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
          UIList
        </h1>
        <span class="hidden sm:block text-sm font-medium text-gray-500">| Components</span>
      </div>

      <div class="flex flex-wrap items-center space-x-2 sm:space-x-4 w-full sm:w-auto">
        <UInput
          v-model="searchTerm"
          :placeholder="`Search in ${currentType || 'All'}...`"
          icon="i-heroicons-magnifying-glass-20-solid"
          class="flex-grow sm:flex-grow-0 min-w-[200px]"
          variant="none"
          :ui="{
            base: 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 rounded-xl',
          }"
        />

        <USelect
          :options="['Newest', 'Popular', 'Random']"
          variant="none"
          class="min-w-[120px]"
          :ui="{ base: 'bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus:ring-blue-500 rounded-xl' }"
        />

        <div class="hidden sm:flex space-x-1 p-1 bg-gray-200 dark:bg-gray-700 rounded-xl">
          <UButton
            icon="i-heroicons-squares-2x2-solid"
            size="sm"
            square
            :variant="viewMode === 'grid' ? 'solid' : 'ghost'"
            :color="viewMode === 'grid' ? 'primary' : 'neutral'"
            @click="viewMode = 'grid'"
          />
          <UButton
            icon="i-heroicons-list-bullet-solid"
            size="sm"
            square
            :variant="viewMode === 'list' ? 'solid' : 'ghost'"
            :color="viewMode === 'list' ? 'primary' : 'neutral'"
            @click="viewMode = 'list'"
          />
        </div>

        <UButton
          :icon="isDark ? 'i-heroicons-sun-20-solid' : 'i-heroicons-moon-20-solid'"
          :color="isDark ? 'warning' : 'primary'"
          variant="ghost"
          size="md"
          class="transition-colors duration-300"
          @click="isDark = !isDark"
        />

        <UButton
          icon="i-heroicons-plus-solid"
          color="secondary"
          variant="solid"
          size="md"
          label="Create"
          class="ml-2 shadow-lg shadow-pink-600/30"
        />
      </div>
    </UContainer>

    <main class="flex flex-1">
      <aside class="w-56 hidden md:block bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav class="space-y-2">
          <h2 class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
            Categories
          </h2>

          <UButton
            label="All Components"
            block
            :variant="currentType === null ? 'solid' : 'ghost'"
            :color="currentType === null ? 'primary' : 'neutral'"
            @click="currentType = null"
          />

          <UButton
            v-for="type in COMPONENT_TYPES"
            :key="type"
            :label="type"
            block
            :variant="currentType === type ? 'solid' : 'ghost'"
            :color="currentType === type ? 'primary' : 'neutral'"
            @click="currentType = type"
          />
        </nav>
        <div class="mt-8 pt-8 border-t border-gray-200 dark:border-gray-700">
          <h2 class="text-xs font-semibold uppercase text-gray-500 dark:text-gray-400 mb-2">
            My List
          </h2>
          <UButton
            label="My favorites"
            block
            variant="ghost"
            color="neutral"
          />
        </div>
      </aside>

      <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <h2 class="text-xl font-bold mb-4 text-gray-900 dark:text-white">
          {{ currentType ? `${currentType} Components` : 'All Components' }}
          <UIcon
            v-if="loading && components.length === 0"
            name="i-heroicons-arrow-path"
            class="w-5 h-5 animate-spin inline-block ml-3 text-blue-400"
          />
        </h2>

        <UAlert
          v-if="error"
          icon="i-heroicons-exclamation-triangle-20-solid"
          color="error"
          variant="solid"
          title="Error"
          :description="error"
          class="mb-4"
        >
          <template #actions>
            <UButton
              label="Retry"
              color="error"
              variant="link"
              @click="fetchComponents(true, null)"
            />
          </template>
        </UAlert>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          <template v-if="components.length > 0">
            <ComponentCard
              v-for="component in components"
              :key="component.id"
              :component="component"
            />
          </template>
          <template v-else-if="!loading">
            <div class="col-span-full text-center py-10 text-gray-500">
              No components found for this category.
            </div>
          </template>

          <template v-if="loading && components.length === 0">
            <UCard
              v-for="i in 5"
              :key="`skeleton-${i}`"
              class="animate-pulse bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700"
            >
              <div class="h-48 bg-gray-300 dark:bg-gray-700/50 rounded-lg mb-4" />
              <div class="h-4 bg-gray-300 dark:bg-gray-700 rounded w-3/4 mb-2" />
              <div class="h-3 bg-gray-300 dark:bg-gray-700 rounded w-1/2 mb-4" />
              <div class="h-8 bg-gray-300 dark:bg-gray-700 rounded w-full" />
            </UCard>
          </template>
        </div>

        <div class="text-center mt-8">
          <UButton
            v-if="hasMore && components.length > 0"
            :disabled="loading"
            color="primary"
            variant="solid"
            size="xl"
            :label="loading ? 'Loading...' : 'Load More Components'"
            :loading="loading"
            class="shadow-md shadow-blue-600/30"
            @click="handleLoadMore"
          />

          <div
            v-else-if="!hasMore && components.length > 0"
            class="text-gray-500 text-sm"
          >
            --- End of results ---
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
