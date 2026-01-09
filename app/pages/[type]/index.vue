<script setup lang="ts">
import { ref, onMounted, watch, computed } from 'vue'
import ComponentCard from '@/components/ComponentCard.vue'
import '~/utils/ComponentPreview.js'

// --- 类型定义 ---
interface IComponentData {
  id: string | number
  title: string
  type: string
  techStack: string
  lastUpdated: string | null
  html: string
  css: string
}

interface ICategory {
  label: string
  icon: string
  to: string
  type: string | null
}

// --- 侧边栏分类数据 (复刻 uiverse.io) ---
const CATEGORIES: ICategory[] = [
  { label: 'All', icon: 'i-heroicons-book-open', to: '/elements', type: null },
  { label: 'Buttons', icon: 'i-heroicons-play-circle', to: '/buttons', type: 'Button' },
  { label: 'Checkboxes', icon: 'i-heroicons-check-circle', to: '/checkboxes', type: 'Checkboxes' },
  { label: 'Toggle switches', icon: 'i-heroicons-arrows-right-left', to: '/toggle', type: 'Toggle' },
  { label: 'Cards', icon: 'i-heroicons-square-2-stack', to: '/card', type: 'Card' },
  { label: 'Loaders', icon: 'i-heroicons-arrow-path', to: '/loader', type: 'Loader' },
  { label: 'Inputs', icon: 'i-heroicons-pencil-square', to: '/input', type: 'Input' },
  { label: 'Radio buttons', icon: 'i-heroicons-list-bullet', to: '/radio', type: 'Radio' },
  { label: 'Forms', icon: 'i-heroicons-clipboard-document-check', to: '/form', type: 'Form' },
]

// --- 主题控制 ---
const colorMode = useColorMode()
const isDark = computed({
  get() {
    return colorMode.preference === 'dark'
  },
  set(val: boolean) {
    colorMode.preference = val ? 'dark' : 'light'
  },
})

// --- 响应式状态 ---
const components = ref<IComponentData[]>([])
const loading = ref(false)
const error = ref<string | null>(null)
const nextCursor = ref<string | null>(null)
const hasMore = ref(true)
const currentType = ref<string | null>(null)

// UI 状态
const searchTerm = ref('')
const limit = 50
const route = useRoute()

// --- 数据获取逻辑 ---
const fetchWithRetry = async (url: string, options: RequestInit = {}, retries = 3): Promise<Response> => {
  for (let i = 0; i < retries; i++) {
    try {
      const response = await fetch(url, options)
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`)
      return response
    }
    catch (e) {
      if (i === retries - 1) throw e
      const delay = Math.pow(2, i) * 1000
      await new Promise(resolve => setTimeout(resolve, delay))
    }
  }
  throw new Error('Exceeded max retries.')
}

const fetchComponents = async (reset = false, cursor: string | null = null) => {
  loading.value = true
  error.value = null

  const queryParams = new URLSearchParams()
  if (cursor) queryParams.append('cursor', cursor)
  if (currentType.value) queryParams.append('type', currentType.value)
  queryParams.append('limit', limit.toString())

  const url = `/api/components/list?${queryParams.toString()}`

  try {
    const response = await fetchWithRetry(url)
    const data = await response.json()
    const newComponents: IComponentData[] = Array.isArray(data.components) ? data.components : []

    components.value = reset ? newComponents : [...components.value, ...newComponents]
    nextCursor.value = data.nextCursor || null
    hasMore.value = data.hasMore ?? false
  }
  catch (err) {
    console.error('Failed to fetch components:', err)
    error.value = '组件加载失败，请稍后重试。'
  }
  finally {
    loading.value = false
  }
}

// --- 生命周期与监听 ---
onMounted(() => {
  const typeFromQuery = route.query.type as string | undefined
  currentType.value = typeFromQuery || null
  fetchComponents(true, null)
})

watch(() => route.query.type, (newType) => {
  currentType.value = (newType as string) || null
  fetchComponents(true, null)
})

const handleLoadMore = () => {
  if (nextCursor.value && !loading.value) {
    fetchComponents(false, nextCursor.value)
  }
}
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
    <main class="flex flex-1">
      <aside class="w-60 hidden md:block bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav class="flex flex-col gap-y-1">
          <h2 class="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
            Browse Elements
          </h2>

          <NuxtLink
            v-for="item in CATEGORIES"
            :key="item.label"
            :to="item.to"
            class="group flex items-center gap-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all duration-200"
            :class="currentType === item.type
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'"
          >
            <UIcon
              :name="item.icon"
              class="w-5 h-5 flex-shrink-0 transition-colors"
              :class="currentType === item.type ? 'text-blue-500' : 'text-gray-400 group-hover:text-gray-600 dark:group-hover:text-gray-300'"
            />
            <span>{{ item.label }}</span>
          </NuxtLink>
        </nav>

        <div class="mt-8 pt-6 border-t border-gray-100 dark:border-gray-800">
          <h2 class="px-3 text-[10px] font-bold uppercase tracking-widest text-gray-400 dark:text-gray-500 mb-2">
            Personal
          </h2>
          <NuxtLink
            to="/my-favorites"
            class="group flex items-center gap-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-all"
          >
            <UIcon
              name="i-heroicons-bookmark"
              class="w-5 h-5 text-gray-400 group-hover:text-pink-500"
            />
            <span>My favorites</span>
          </NuxtLink>
        </div>
      </aside>

      <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div class="w-full flex justify-between items-center pb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            {{ currentType ? `${currentType} Components` : 'All Components' }}
          </h2>
          <div class="flex items-center space-x-3">
            <UInput
              v-model="searchTerm"
              placeholder="Search..."
              icon="i-heroicons-magnifying-glass"
              class="hidden sm:block min-w-[240px]"
              :ui="{ base: 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 rounded-xl' }"
            />
            <UButton
              :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              color="neutral"
              variant="ghost"
              @click="isDark = !isDark"
            />
          </div>
        </div>

        <UAlert
          v-if="error"
          color="error"
          variant="soft"
          :title="error"
          class="mb-6"
        />

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          <template v-if="components.length > 0">
            <ComponentCard
              v-for="component in components"
              :key="component.id"
              :component="component"
            />
          </template>

          <template v-if="loading && components.length === 0">
            <div
              v-for="i in 8"
              :key="i"
              class="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"
            />
          </template>
        </div>

        <div class="mt-12 flex justify-center">
          <UButton
            v-if="hasMore"
            :loading="loading"
            label="Load More Components"
            size="xl"
            class="rounded-2xl px-8 shadow-lg shadow-primary-500/20"
            @click="handleLoadMore"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* 针对 Webkit 浏览器的滚动条优化，使其更接近 uiverse */
aside::-webkit-scrollbar {
  width: 4px;
}
aside::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 10px;
}
aside:hover::-webkit-scrollbar-thumb {
  background: #e2e8f0;
}
.dark aside:hover::-webkit-scrollbar-thumb {
  background: #334155;
}
</style>
