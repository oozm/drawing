<script setup lang="ts">
import { ref, computed } from 'vue'
import ComponentCard from '@/components/ComponentCard.vue'
import '~/utils/ComponentPreview.js'

const { $api } = useNuxtApp()

// --- 类型定义 ---
interface IComponentData {
  id: string | number
  title: string
  type: string
  username?: string
  html: string
  css: string
}

interface ICategory {
  label: string
  icon: string
  to: string
  type: string | null
}

// --- 侧边栏分类数据 ---
const CATEGORIES: ICategory[] = [
  { label: 'All', icon: 'i-heroicons-book-open', to: '/elements', type: null },
  { label: 'Buttons', icon: 'i-heroicons-play-circle', to: '/buttons', type: 'buttons' },
  { label: 'Checkboxes', icon: 'i-heroicons-check-circle', to: '/checkboxes', type: 'checkboxes' },
  { label: 'Toggle switches', icon: 'i-heroicons-arrows-right-left', to: '/toggle', type: 'toggle' },
  { label: 'Cards', icon: 'i-heroicons-square-2-stack', to: '/card', type: 'card' },
  { label: 'Loaders', icon: 'i-heroicons-arrow-path', to: '/loader', type: 'loader' },
  { label: 'Inputs', icon: 'i-heroicons-pencil-square', to: '/input', type: 'input' },
  { label: 'Radio buttons', icon: 'i-heroicons-list-bullet', to: '/radio', type: 'radio' },
  { label: 'Forms', icon: 'i-heroicons-clipboard-document-check', to: '/form', type: 'form' },
]

// --- 主题控制 ---
const colorMode = useColorMode()
const isDark = computed({
  get: () => colorMode.preference === 'dark',
  set: (val: boolean) => colorMode.preference = val ? 'dark' : 'light',
})

// --- 响应式状态 ---
const components = ref<IComponentData[]>([])

// Fetch favorites
const { data, pending, refresh } = await useAsyncData(
  'my-favorites',
  () => $api('/api/user/favorites-list'),
)

if (data.value) {
  components.value = (data.value as any).components || []
}

// Handle login state
const { loggedIn } = useUserSession()
watch(loggedIn, (val) => {
  if (val) refresh()
  else components.value = []
})

// --- UI Logic ---
const currentType = 'favorites'
</script>

<template>
  <div class="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-gray-200 font-sans">
    <main class="flex flex-1">
      <aside class="w-60 hidden md:block bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 p-4 sticky top-16 h-[calc(100vh-4rem)] overflow-y-auto">
        <nav class="flex flex-col gap-y-1">
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
            class="group flex items-center gap-x-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
            :class="currentType === 'favorites'
              ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
              : 'text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50'"
          >
            <UIcon
              name="i-heroicons-bookmark"
              class="w-5 h-5 group-hover:text-pink-500"
              :class="currentType === 'favorites' ? 'text-pink-500' : 'text-gray-400'"
            />
            <span>My favorites</span>
          </NuxtLink>
        </div>
      </aside>

      <div class="flex-1 p-4 sm:p-6 overflow-y-auto">
        <div class="w-full flex justify-between items-center pb-6">
          <h2 class="text-xl font-bold text-gray-900 dark:text-white">
            My Favorites
          </h2>
          <div class="flex items-center space-x-3">
            <UButton
              :icon="isDark ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              color="neutral"
              variant="ghost"
              @click="isDark = !isDark"
            />
          </div>
        </div>

        <div
          v-if="!loggedIn"
          class="flex flex-col items-center justify-center py-20 text-center"
        >
          <UIcon
            name="i-heroicons-lock-closed"
            class="w-12 h-12 text-gray-400 mb-4"
          />
          <h3 class="text-lg font-medium text-gray-900 dark:text-white">
            Sign in to view favorites
          </h3>
          <p class="mt-2 text-gray-500">
            Track components you love.
          </p>
          <UButton
            to="/auth/github"
            external
            color="neutral"
            class="mt-4"
            label="Sign in with GitHub"
          />
        </div>

        <div
          v-else
          class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
        >
          <template v-if="components.length > 0">
            <ComponentCard
              v-for="component in components"
              :key="component.id"
              :component="component"
            />
          </template>

          <template v-else-if="!pending">
            <div class="col-span-full flex flex-col items-center justify-center py-20 text-center text-gray-500">
              <UIcon
                name="i-heroicons-bookmark"
                class="w-12 h-12 mb-4 opacity-50"
              />
              <p>No favorites yet.</p>
              <UButton
                to="/elements"
                variant="link"
                color="primary"
                label="Browse components"
              />
            </div>
          </template>

          <template v-if="pending">
            <div
              v-for="i in 8"
              :key="i"
              class="h-64 bg-gray-200 dark:bg-gray-800 animate-pulse rounded-2xl"
            />
          </template>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
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
