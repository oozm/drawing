<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps<{
  component: {
    id: string | number
    title: string
    type: string
    user?: {
      userName: string
      avatar: string
      id: string | number
    }
  }
}>()

const metadata = ref<any>(null)
const loading = ref(false)
const cardRef = ref<HTMLElement | null>(null)
const previewRef = ref<any>(null)

const { $api } = useNuxtApp()
const { loggedIn } = useUserSession()
const userFavorites = useUserFavorites()

const isFavorited = computed(() => props.component?.id && userFavorites.isFavorited(props.component.id))
const favoritesCount = ref(0)
const viewsCount = ref(0)

const fetchStats = async () => {
  if (!props.component?.id) return
  try {
    const stats = await $api<any>(`/api/components/${props.component.id}/stats`)
    viewsCount.value = stats.views || 0
    favoritesCount.value = stats.favorites || 0

    // Ensure favorites are loaded (deduplicated by composable)
    if (loggedIn.value) {
      userFavorites.fetchFavorites()
    }
  }
  catch (e) {
    console.error('Failed to fetch stats', e)
  }
}

const toggleFavorite = async (e: Event) => {
  e.stopPropagation()
  if (!loggedIn.value) {
    // Open login modal or redirect
    alert('Please login to favorite components')
    return
  }

  // Update local count optimistically
  const wasFavorited = isFavorited.value
  favoritesCount.value += wasFavorited ? -1 : 1

  try {
    const newStatus = await userFavorites.toggleFavorite(props.component.id)
    // If status didn't change as expected (shouldn't happen with our logic but just in case)
    if (newStatus === wasFavorited) {
      favoritesCount.value += wasFavorited ? 1 : -1
    }
  }
  catch {
    // Revert count on error
    favoritesCount.value += wasFavorited ? 1 : -1
  }
}

const fetchMetadata = async () => {
  if (!props.component?.id || props.component.id === 'undefined') {
    return
  }

  loading.value = true
  try {
    // Parallel fetch
    const [data] = await Promise.all([
      $api<any>(`/api/resource/post/metadata/${props.component.id}`, {
        params: { _data: 'routes/resource.post.metadata.$id' },
      }),
      fetchStats(),
    ])

    metadata.value = data

    await nextTick()
    if (previewRef.value) {
      previewRef.value.componentData = {
        html: (data as any).html || '',
        css: (data as any).css || '',
      }
    }
  }
  catch (err) {
    console.error(`请求失败 [${props.component.id}]:`, err)
  }
  finally {
    loading.value = false
  }
}

let observer: IntersectionObserver | null = null

const initObserver = () => {
  if (!cardRef.value || observer) return

  observer = new IntersectionObserver((entries) => {
    const entry = entries[0]
    if (entry && entry.isIntersecting) {
      fetchMetadata()
      observer?.unobserve(cardRef.value!)
    }
  }, {
    threshold: 0.01,
    rootMargin: '50px',
  })

  observer.observe(cardRef.value)
}

onMounted(() => {
  initObserver()
})

onUnmounted(() => observer?.disconnect())

watch(() => props.component?.id, (newId) => {
  if (newId) {
    initObserver()
  }
}, { immediate: true })

const getDetailLink = () => {
  const username = props.component?.user?.userName || 'community'
  const slug = props.component.id
  // Ensure username is URL safe
  const safeUsername = username.replace(/\s+/g, '-').toLowerCase()
  return `/${safeUsername}/${slug}`
}
</script>

<template>
  <div
    ref="cardRef"
    class="group w-full flex flex-col gap-2"
  >
    <!-- Preview Area -->
    <div
      class="relative min-h-[300px] w-full  rounded-xl overflow-hidden border border-[#333] transition-all hover:border-gray-500 hover:shadow-xl cursor-pointer"
      :style="{
        backgroundColor: metadata?.bgColor || '#1a1a1a',
      }"
      @click="navigateTo(getDetailLink())"
    >
      <div class="h-full bg-black/40 flex items-center justify-center relative">
        <div
          v-if="metadata"
          @click.stop
        >
          <component-preview ref="previewRef" />
        </div>

        <div
          v-else
          class="flex flex-col items-center gap-2"
        >
          <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent animate-spin rounded-full" />
          <p class="text-[10px] text-gray-500 uppercase">
            Loading Data...
          </p>
        </div>

        <!-- Hover Overlay (Get Code Button) -->
        <div class="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <UButton
            label="Get Code"
            icon="i-heroicons-code-bracket"
            color="neutral"
            variant="solid"
            size="sm"
            class="font-bold shadow-lg"
            :to="getDetailLink()"
            @click.stop
          />
        </div>
      </div>
    </div>

    <!-- Footer Info -->
    <div class="flex items-center justify-between px-1">
      <!-- User Info -->
      <div class="flex items-center gap-2 min-w-0">
        <UAvatar
          :alt="metadata?.user?.avatar || 'C'"
          size="xs"
          class="bg-gray-800"
          :src="metadata?.user?.avatar || '/avatar.svg'"
        />
        <div class="flex flex-col min-w-0">
          <span class="text-sm font-medium text-gray-200 truncate">{{ metadata?.user?.userName || 'Community' }}</span>
        </div>
      </div>

      <!-- Stats -->
      <div class="flex items-center gap-3 text-xs text-gray-400">
        <div
          class="flex items-center gap-1"
          title="Views"
        >
          <UIcon
            name="i-heroicons-eye"
            class="w-4 h-4"
          />
          <span>{{ viewsCount }}</span>
        </div>
        <div
          class="flex items-center gap-1 cursor-pointer hover:text-white transition-colors"
          :class="{ 'text-yellow-400 hover:text-yellow-300': isFavorited }"
          title="Favorites"
          @click="toggleFavorite"
        >
          <UIcon
            :name="isFavorited ? 'i-heroicons-bookmark-solid' : 'i-heroicons-bookmark'"
            class="w-4 h-4"
          />
          <span>{{ favoritesCount }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
