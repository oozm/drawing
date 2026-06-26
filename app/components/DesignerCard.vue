<script setup lang="ts">
import type { Designer } from '~~/types/designer'

const props = defineProps<{
  designer: Designer
}>()

const copied = ref(false)
let copyTimer: ReturnType<typeof setTimeout> | null = null

async function copyPortfolioLink() {
  try {
    await navigator.clipboard.writeText(props.designer.portfolioUrl)
    copied.value = true
    if (copyTimer) clearTimeout(copyTimer)
    copyTimer = setTimeout(() => {
      copied.value = false
    }, 2000)
  }
  catch {
    copied.value = false
  }
}

onUnmounted(() => {
  if (copyTimer) clearTimeout(copyTimer)
})

function formatLikes(count: number) {
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1).replace(/\.0$/, '')}k`
  }
  return String(count)
}
</script>

<template>
  <article
    class="group flex flex-col overflow-hidden rounded-2xl border border-neutral-800/80 bg-neutral-900/60 shadow-lg shadow-black/20 backdrop-blur-sm transition-all duration-300 hover:border-neutral-600/80 hover:shadow-xl hover:shadow-black/30"
  >
    <!-- Cover -->
    <div class="relative aspect-[16/10] overflow-hidden">
      <img
        :src="designer.coverImage"
        :alt="`${designer.name} 作品封面`"
        class="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-110"
      >
      <div
        class="pointer-events-none absolute inset-0 bg-gradient-to-t from-neutral-950/90 via-neutral-950/20 to-transparent"
      />

      <div
        class="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/50 px-2.5 py-1 text-xs font-medium text-white/90 backdrop-blur-md"
      >
        <UIcon
          name="i-heroicons-heart-solid"
          class="size-3.5 text-rose-400"
        />
        <span>{{ formatLikes(designer.likes) }}</span>
      </div>
    </div>
    <div class="flex flex-1 flex-col gap-4 p-5">
      <div class="flex items-start gap-3.5">
        <img
          :src="designer.avatar"
          :alt="designer.name"
          class="size-12 shrink-0 rounded-full ring-2 ring-neutral-700/80 ring-offset-2 ring-offset-neutral-900"
        >
        <div class="min-w-0 flex-1 pt-0.5">
          <h3 class="truncate text-base font-semibold tracking-tight text-white">
            {{ designer.name }}
          </h3>
          <p class="mt-1.5 line-clamp-2 text-sm leading-relaxed text-neutral-400">
            {{ designer.bio }}
          </p>
        </div>
      </div>

      <div class="flex flex-wrap gap-1.5">
        <span
          v-for="tag in designer.tags"
          :key="tag"
          class="rounded-full bg-neutral-800/80 px-2.5 py-0.5 text-xs font-medium text-neutral-300"
        >
          {{ tag }}
        </span>
      </div>

      <div class="mt-auto flex items-center gap-2 border-t border-neutral-800/80 pt-4">
        <a
          :href="designer.portfolioUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-white/5 px-4 py-2.5 text-sm font-medium text-neutral-200 transition-colors hover:bg-white/10"
        >
          <UIcon
            name="i-heroicons-arrow-top-right-on-square"
            class="size-4"
          />
          查看作品集
        </a>
        <button
          type="button"
          class="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium transition-all"
          :class="copied
            ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/30'
            : 'bg-neutral-800 text-neutral-300 hover:bg-neutral-700 hover:text-white'"
          :title="copied ? '已复制' : '复制作品集链接'"
          @click="copyPortfolioLink"
        >
          <UIcon
            :name="copied ? 'i-heroicons-check' : 'i-heroicons-link'"
            class="size-4"
          />
          <span class="hidden sm:inline">{{ copied ? '已复制' : '复制链接' }}</span>
        </button>
      </div>
    </div>
  </article>
</template>
