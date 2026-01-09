<template>
  <footer
    class="border-t bg-black text-slate-400 border-slate-800 dark:bg-black"
  >
    <UContainer class="py-10 flex flex-col gap-8">
      <!-- 上半部分：logo / 文案 / MIT 声明 / 社交 -->
      <div class="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
        <div class="space-y-3">
          <!-- Logo -->
          <NuxtLink
            to="/"
            class="inline-flex items-center gap-2"
          >
            <span class="text-2xl font-semibold tracking-tight leading-none text-slate-50">
              <span
                class="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent"
              >
                ui
              </span>
              <span>list</span>
            </span>
          </NuxtLink>

          <!-- 副标题 -->
          <p class="text-sm text-slate-400">
            Uilist ｜ The universe of UI
          </p>

          <!-- MIT License 声明 -->
          <div class="mt-4 space-y-1.5">
            <div class="inline-flex items-center gap-2 text-sm font-semibold text-slate-100">
              <UIcon
                name="i-lucide-scale"
                class="h-4 w-4"
              />
              <span>MIT License</span>
            </div>
            <p class="text-xs text-slate-400 leading-relaxed max-w-md">
              All content (UI elements) on this site are published under the
              <NuxtLink
                to="https://opensource.org/license/mit"
                class="underline hover:text-slate-200"
                target="_blank"
              >
                MIT License
              </NuxtLink>.
            </p>
          </div>
        </div>

        <!-- 社交链接 -->
        <div class="flex items-start gap-4 md:items-center">
          <NuxtLink
            v-for="social in socials"
            :key="social.label"
            :to="social.href"
            target="_blank"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-slate-700 text-slate-300 hover:bg-slate-800 hover:text-white"
          >
            <UIcon
              :name="social.icon"
              class="h-4 w-4"
            />
          </NuxtLink>
        </div>
      </div>

      <!-- 底部版权 -->
      <div class="text-xs text-slate-500">
        © {{ year }} Uilist. All rights reserved – uilist.com
      </div>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()

const socials = [
  {
    label: 'Instagram',
    href: 'https://instagram.com',
    icon: 'i-simple-icons-instagram',
  },
  {
    label: 'X',
    href: 'https://x.com',
    icon: 'i-simple-icons-x',
  },
  {
    label: 'Discord',
    href: 'https://discord.com',
    icon: 'i-simple-icons-discord',
  },
]
</script>
