<script setup lang="ts">
import { ref, computed, watch, nextTick, onMounted } from 'vue'
import '~/utils/ComponentPreview.js'

const { $api } = useNuxtApp()
const route = useRoute()
const username = route.params.username as string
const slug = route.params.slug as string

// --- Categories (Reused from list page) ---
interface ICategory {
  label: string
  icon: string
  to: string
  type: string | null
}

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

const bgColor = ref('#e8e8e8')
// --- State ---
const activeTab = ref<'html' | 'css'>('css')
const previewRef = ref<any>(null)
const colorMode = ref('light')
const renderPreview = () => {
  if (previewRef.value) {
    previewRef.value?.render?.()
  }
}

const toggleColorMode = () => {
  colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
  bgColor.value = colorMode.value === 'light' ? '#e8e8e8' : '#000000'
  renderPreview()
}
// Fetch Data
const { data: component, pending, error } = await useAsyncData<any>(
  `component-${slug}`,
  () => $api(`/api/resource/post/metadata/${slug}`, {
    params: { _data: 'routes/resource.post.metadata.$id' },
  }),
)
bgColor.value = component?.value.bgColor || '#e8e8e8'

// Update preview when data is ready
watch(component, async (newData: any) => {
  if (newData && previewRef.value) {
    await nextTick()

    previewRef.value.componentData = {
      html: newData?.html || '',
      css: newData?.css || '',
      mode: newData?.mode || 'light',
    }
  }
}, { immediate: true })

onMounted(async () => {
  if (component.value && previewRef.value) {
    await nextTick()
    previewRef.value.componentData = {
      html: (component.value as any)?.html || '',
      css: (component.value as any)?.css || '',
      mode: (component.value as any)?.mode || 'light',
    }
  }
})

// Stats (Mocked or from data)
const stats = computed(() => (component.value as any)?.stats || { likes: 0, views: 0 })
const authorName = computed(() => (component.value as any)?.user?.name || username)
const _authorId = computed(() => (component.value as any)?.user?.id || 'community')
</script>

<template>
  <div class="h-[calc(100vh-4rem)] flex overflow-hidden  text-white">
    <!-- Left Sidebar -->
    <aside class="w-64 flex-shrink-0 bg-black border-r border-gray-800 flex flex-col">
      <div class="flex-1 overflow-y-auto p-2">
        <nav class="space-y-1">
          <NuxtLink
            v-for="item in CATEGORIES"
            :key="item.label"
            :to="item.to"
            class="flex items-center gap-3 px-3 py-2 rounded-lg  text-gray-400 hover:text-white hover:bg-gray-900 transition-colors"
          >
            <UIcon
              :name="item.icon"
              class="w-5 h-5"
            />
            {{ item.label }}
          </NuxtLink>
        </nav>
      </div>
    </aside>

    <!-- Center Preview -->
    <main class="flex flex-col flex-1 ">
      <div class="flex items-center gap-4 p-4 justify-between">
        <NuxtLink
          to="/elements"

          class="flex items-center  hover:text-white transition-colors gap-2 text-sm font-medium"
        >
          <UIcon name="i-heroicons-arrow-left" />
          Go back
        </NuxtLink>
        <div class="flex items-center gap-3">
          <div class="text-right flex items-center gap-1">
            <div class=" text-gray-400">
              {{ component?.type || 'Component' }} by
            </div>
            <UAvatar
              :alt="authorName"
              size="sm"
            />
            <div class="font-bold text-white">
              {{ authorName }}
            </div>
          </div>

          <div class="flex items-center gap-3  text-gray-400 ml-2">
            <div class="flex items-center gap-1">
              <UIcon name="i-heroicons-eye" /> {{ stats.views }}
            </div>
            <div class="flex items-center gap-1">
              <!-- 收藏 按钮 -->
              <UIcon name="i-heroicons-bookmark" /> {{ stats.likes }}
            </div>
          </div>
        </div>
      </div>
      <div class="flex-1 flex">
        <main class="flex-1 relative flex flex-col min-w-0">
          <!-- Toolbar -->
          <div class="h-10 bg-[var(--bg-color)] border-b border-gray-200 dark:border-gray-800 flex items-center justify-between ">
            <span class="text-xs text-gray-500 px-4">Preview</span>
            <div class="flex items-center gap-2">
              <span class="text-xs text-gray-500 font-mono">{{ bgColor }}</span>
              <div class="flex px-2 items-center gap-2 bg-[var(--bg-color)] dark:bg-gray-800 rounded p-0.5">
                <ColorPicker v-model="bgColor">
                  <template #trigger>
                    <button
                      type="button"
                      :style="{ backgroundColor: bgColor }"
                      class="w-5 h-5 rounded hover:scale-110 transition-transform border border-gray-600"
                    />
                  </template>
                </ColorPicker>
                <!-- 主题切换 -->
                <UButton
                  :icon="colorMode === 'light' ? 'i-lucide-moon' : 'i-lucide-sun'"
                  :aria-label="`Switch to ${colorMode === 'light' ? 'light' : 'dark'} mode`"
                  color="neutral"
                  variant="ghost"
                  class=" rounded-full"
                  @click="toggleColorMode"
                />
              </div>
            </div>
          </div>

          <!-- Canvas -->
          <div
            class="flex-1 flex items-center justify-center transition-colors duration-300 overflow-auto p-8"
            :style="{ backgroundColor: bgColor }"
          >
            <div
              v-if="pending"
              class="flex flex-col items-center gap-4"
            >
              <UIcon
                name="i-heroicons-arrow-path"
                class="w-8 h-8 animate-spin text-gray-400"
              />
              <p class="text-gray-400 ">
                Loading component...
              </p>
            </div>
            <div
              v-else-if="error"
              class="text-red-500"
            >
              Failed to load component: {{ error.message }}
            </div>
            <component-preview
              v-else
              ref="previewRef"
            />
          </div>
        </main>

        <!-- Right Code Panel -->
        <aside class="w-[450px] flex-shrink-0 bg-[var(--code-bg-color)] border-l border-gray-800 flex flex-col">
          <!-- Header -->
          <header class="h-14 flex items-center justify-between px-4 border-b border-gray-800 bg-[var(--code-bg-color)]">
            <div class="flex gap-4">
              <button
                class="px-3 py-1.5  font-medium rounded-md transition-colors"
                :class="activeTab === 'html' ? 'bg-[var(--code-bg-color)] text-white' : 'text-gray-400 hover:text-white'"
                @click="activeTab = 'html'"
              >
                HTML
              </button>
              <button
                class="px-3 py-1.5  font-medium rounded-md transition-colors"
                :class="activeTab === 'css' ? 'bg-[var(--code-bg-color)] text-white' : 'text-gray-400 hover:text-white'"
                @click="activeTab = 'css'"
              >
                CSS
              </button>
            </div>
          </header>

          <!-- Editor -->
          <div class="flex-1 relative overflow-hidden">
            <ClientOnly>
              <MonacoEditor
                v-if="component"
                v-model="component[activeTab]"
                :lang="activeTab"
                :options="{
                  theme: 'vs-dark',
                  readOnly: true,
                  minimap: { enabled: false },
                  fontSize: 13,
                  scrollBeyondLastLine: false,
                  padding: { top: 16 },
                }"
                class="h-full w-full"
              />
            </ClientOnly>
          </div>
        </aside>
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Scrollbar customization for the sidebar */
aside::-webkit-scrollbar {
  width: 6px;
}
aside::-webkit-scrollbar-track {
  background: transparent;
}
aside::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}
aside::-webkit-scrollbar-thumb:hover {
  background: #444;
}
</style>
