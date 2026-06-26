<script setup lang="ts">
import type { Designer } from '~~/types/designer'

const SEO_TITLE = 'UIList - 全球顶尖 UI 设计师作品集门户'
const SEO_DESCRIPTION = '发现全球顶尖 UI 设计师的精选作品集，按标签浏览品牌设计、交互、动效与设计系统等领域作品，一键访问设计师个人主页。'
const SEO_OG_IMAGE = 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=1200&h=630&fit=crop&q=80'

useSeoMeta({
  title: SEO_TITLE,
  description: SEO_DESCRIPTION,
  ogTitle: SEO_TITLE,
  ogDescription: SEO_DESCRIPTION,
  ogImage: SEO_OG_IMAGE,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: SEO_TITLE,
  twitterDescription: SEO_DESCRIPTION,
  twitterImage: SEO_OG_IMAGE,
})

const route = useRoute()
const router = useRouter()

const currentTag = computed(() => {
  const tag = route.query.tag
  return typeof tag === 'string' && tag.trim() ? tag.trim() : undefined
})

const { data: designers, pending, error } = await useFetch<Designer[]>('/api/designers', {
  query: computed(() => ({
    tag: currentTag.value,
  })),
  watch: [currentTag],
})

const { data: allDesigners } = await useFetch<Designer[]>('/api/designers')

const availableTags = computed(() => {
  const tagSet = new Set<string>()
  allDesigners.value?.forEach((designer) => {
    designer.tags.forEach(tag => tagSet.add(tag))
  })
  return Array.from(tagSet).sort((a, b) => a.localeCompare(b, 'zh-CN'))
})

function onTagChange(tag: string | null) {
  router.push({
    path: route.path,
    query: tag ? { tag } : {},
  })
}
</script>

<template>
  <div class="min-h-screen bg-neutral-950 text-neutral-100">
    <AppHeader />

    <div class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <!-- Hero -->
      <section class="mb-10 text-center">
        <h1 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">
          发现顶尖 UI 设计师
        </h1>
        <p class="mx-auto mt-3 max-w-2xl text-neutral-400">
          浏览精选作品集，按专业标签筛选你感兴趣的设计领域
        </p>
      </section>

      <!-- Tag filter -->
      <section class="mb-8">
        <TagFilter
          :tags="availableTags"
          :current-tag="currentTag ?? null"
          @change="onTagChange"
        />
      </section>

      <!-- Loading -->
      <motion.div
        v-if="pending"
        class="flex justify-center py-24"
      >
        <div class="size-8 animate-spin rounded-full border-2 border-blue-500 border-t-transparent" />
      </motion.div>

      <!-- Error -->
      <div
        v-else-if="error"
        class="rounded-2xl border border-red-500/30 bg-red-500/10 px-6 py-12 text-center text-red-400"
      >
        加载设计师数据失败，请稍后重试
      </div>

      <!-- Empty -->
      <div
        v-else-if="!designers?.length"
        class="rounded-2xl border border-neutral-800 bg-neutral-900/50 px-6 py-16 text-center text-neutral-400"
      >
        <UIcon
          name="i-heroicons-user-group"
          class="mx-auto mb-3 size-10 text-neutral-600"
        />
        <p>暂无匹配「{{ currentTag }}」标签的设计师</p>
        <button
          type="button"
          class="mt-4 text-sm text-blue-400 hover:text-blue-300"
          @click="onTagChange(null)"
        >
          查看全部设计师
        </button>
      </div>

      <!-- Grid -->
      <section
        v-else
        class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
      >
        <DesignerCard
          v-for="designer in designers"
          :key="designer.id"
          :designer="designer"
        />
      </section>
    </div>
  </div>
</template>
