<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import ComponentCard from '@/components/ComponentCard.vue'
import '~/utils/ComponentPreview.js'

const { $api } = useNuxtApp()

// --- 类型定义保持不变 ---
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

// --- 响应式状态 ---
const components = ref<IComponentData[]>([])
const loading = ref(false)
const nextCursor = ref<string | null>(null)
const hasMore = ref(true)
const route = useRoute()
const searchTerm = ref((route.query.q as string) || '')

// 1. 提取路径参数
const categoryParam = computed(() => (route.params.category as string) || 'elements')

// 这里的请求地址现在变成了当前页面路径本身
const { data } = await useAsyncData(
  `data-${route.params.category}-${route.query.q}`,
  () => $api(`/api/components/${categoryParam.value}`, {
    params: {
      _data: 'routes/$category',
      page: 1,
      q: route.query.q,
    },
  }),
  { watch: [() => route.params.category, () => route.query.q] },
)

// 3. 核心修复：监听 data 变化，将其同步到你的 components 数组中
watch(data, (newData: any) => {
  if (newData) {
    components.value = newData.components || []
    nextCursor.value = newData.nextCursor || null
    hasMore.value = newData.hasMore ?? false
  }
}, { immediate: true })

// 4. 修复加载更多逻辑
const loadMore = async () => {
  if (loading.value || !hasMore.value) return

  loading.value = true
  try {
    const res: any = await $api(`/api/components/${categoryParam.value}`, {
      params: {
        _data: 'routes/$category',
        cursor: nextCursor.value,
        page: (Number(route.query.page) || 1) + 1,
        q: route.query.q,
      },
    })

    if (res?.components) {
      components.value.push(...res.components)
      nextCursor.value = res.nextCursor || null
      hasMore.value = res.hasMore ?? false
    }
  }
  catch {
    // Global error handler
  }
  finally {
    loading.value = false
  }
}

const handleSearch = () => {
  navigateTo({
    path: route.path,
    query: {
      ...route.query,
      q: searchTerm.value || undefined,
      page: 1,
    },
  })
}

// 5. 绑定到你的原有函数名
const handleLoadMore = () => {
  loadMore()
}

// 侧边栏高亮逻辑修复：与 categoryParam 匹配
const currentType = computed(() => categoryParam.value)

// 移除原有的 onMounted 重复请求，避免冲突
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
              @keydown.enter="handleSearch"
            />
            <!-- <UButton
              :icon="colorMode === 'dark' ? 'i-heroicons-sun' : 'i-heroicons-moon'"
              color="neutral"
              variant="ghost"
              @click="colorMode = colorMode === 'dark' ? 'light' : 'dark'"
            /> -->
          </div>
        </div>

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
