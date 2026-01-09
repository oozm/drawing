<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'

const props = defineProps<{
  component: {
    id: string | number
    title: string
    type: string
  }
}>()

const metadata = ref(null)
const loading = ref(false)
const cardRef = ref<HTMLElement | null>(null)
const previewRef = ref(null)

const fetchMetadata = async () => {
  // 打印日志，确认逻辑是否走到这里
  console.log('触发请求，当前 ID:', props.component?.id)

  if (!props.component?.id || props.component.id === 'undefined') {
    console.warn('ID 无效，取消请求')
    return
  }

  loading.value = true
  try {
    const data = await $fetch(`/api/resource/post/metadata/${props.component.id}`, {
      params: { _data: 'routes/resource.post.metadata.$id' },
    })
    metadata.value = data

    await nextTick()
    if (previewRef.value) {
      previewRef.value.componentData = {
        html: data.html || '',
        css: data.css || '',
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

  observer = new IntersectionObserver(([entry]) => {
    // 增加调试：看看卡片是否被识别为可见
    if (entry.isIntersecting) {
      console.log(`卡片可见: ${props.component.title}`)
      fetchMetadata()
      observer?.unobserve(cardRef.value!)
    }
  }, {
    threshold: 0.01, // 降低阈值，只要露头就加载
    rootMargin: '50px', // 缩小边距，避免一次性加载太多
  })

  observer.observe(cardRef.value)
}

onMounted(() => {
  // 必须确保在挂载后启动
  initObserver()
})

onUnmounted(() => observer?.disconnect())

// 核心：如果 id 是异步来的，必须 watch
watch(() => props.component?.id, (newId) => {
  if (newId) {
    console.log('ID 已更新，重新启动观察者:', newId)
    initObserver()
  }
}, { immediate: true })
</script>

<template>
  <div
    ref="cardRef"
    class="min-h-[350px] w-full bg-[#1a1a1a] rounded-xl overflow-hidden border border-[#333]"
  >
    <div class="h-48 bg-black/40 flex items-center justify-center relative">
      <component-preview
        v-if="metadata"
        ref="previewRef"
      />

      <div
        v-else
        class="flex flex-col items-center gap-2"
      >
        <div class="w-6 h-6 border-2 border-blue-500 border-t-transparent animate-spin rounded-full" />
        <p class="text-[10px] text-gray-500 uppercase">
          Loading Data...
        </p>
      </div>
    </div>
  </div>
</template>
