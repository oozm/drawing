<template>
  <!-- header 本身支持明/暗 -->
  <header
    class="sticky top-0 z-30 border-b bg-white/80 text-slate-900 backdrop-blur border-slate-200 dark:bg-black/80 dark:text-slate-50 dark:border-slate-800"
  >
    <div class="flex px-5 py-3 h-14 items-center justify-between">
      <div class="flex items-center justify-between">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="flex items-center gap-2"
        >
          <span class="text-lg font-semibold tracking-tight leading-none">
            <span
              class="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent"
            >
              ui
            </span>
            <span>list</span>
          </span>
        </NuxtLink>

        <!-- 中间导航：桌面 -->
        <nav class="hidden items-center gap-1 text-sm md:flex">
          <UButton
            v-for="item in navItems"
            :key="item.to"
            :to="item.to"
            variant="ghost"
            color="neutral"
            size="sm"
            class="rounded-lg px-3 py-1.5 bg-transparent"
            trailing-icon="i-lucide-chevron-down"
            :class="
              isActive(item)
                ? 'bg-slate-900 text-slate-50 font-semibold'
                : 'text-slate-900 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-50 dark:hover:bg-slate-900 dark:hover:text-slate-50/90'
            "
          >
            <span class="inline-flex items-center gap-1">
              {{ item.label }}
              <span
                v-if="item.isLive"
                class="h-1.5 w-1.5 rounded-full bg-emerald-400"
              />
            </span>
          </UButton>
        </nav>
      </div>

      <!-- 右侧：桌面 -->
      <div class="hidden items-center gap-3 md:flex">
        <!-- 积分气泡 -->
        <UButton
          variant="soft"
          color="neutral"
          size="xs"
          class="rounded-full border bg-slate-100 text-xs border-slate-200 dark:bg-slate-900 dark:border-slate-700"
        >
          <span
            class="inline-flex h-5 w-5 items-center justify-center rounded-full border text-[10px] border-slate-300 dark:border-slate-700"
          >
            ⚡
          </span>
          <span class="ml-1">0</span>
        </UButton>

        <!-- Create -->
        <UButton
          size="sm"
          to="/create"
          class="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md shadow-fuchsia-500/30 hover:brightness-110 border-0"
        >
          Create
        </UButton>

        <!-- 通知 -->
        <UButton
          icon="i-heroicons-bell-20-solid"
          color="neutral"
          variant="ghost"
          size="sm"
          class="h-8 w-8 rounded-full border bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
          aria-label="Notifications"
        />

        <!-- 用户头像 -->
        <UAvatar
          size="sm"
          class="bg-slate-200 text-xs dark:bg-slate-800"
          src=""
          alt="User"
          text="YY"
        />

        <!-- 主题切换 -->
        <ClientOnly v-if="!colorMode?.forced">
          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
            color="neutral"
            variant="ghost"
            class=" rounded-full"
            @click="toggleColorMode"
          />
        </ClientOnly>
        <LoginModal />
      </div>

      <!-- 移动端菜单按钮 -->
      <UButton
        class="flex h-9 w-9 items-center justify-center rounded-md border bg-slate-100 text-slate-900 border-slate-300 hover:border-slate-400 md:hidden dark:bg-black/60 dark:text-slate-100 dark:border-slate-500/60 dark:hover:border-slate-300"
        variant="ghost"
        color="neutral"
        size="xs"
        aria-label="Open menu"
        @click="isMobileOpen = true"
      >
        <UIcon name="i-heroicons-bars-3-20-solid" />
      </UButton>
    </div>

    <!-- 移动端抽屉菜单 -->
    <USlideover
      v-model="isMobileOpen"
      side="right"
      overlay
      :transition="true"
      class="md:hidden"
    >
      <div class="flex h-full flex-col bg-white text-slate-900 dark:bg-black dark:text-slate-100">
        <!-- 顶部：logo + 关闭 -->
        <div class="flex h-14 items-center justify-between border-b px-4 border-slate-200 dark:border-slate-800">
          <NuxtLink
            to="/"
            class="flex items-center gap-2"
            @click="closeMobile"
          >
            <span class="text-lg font-semibold tracking-tight leading-none">
              <span
                class="bg-gradient-to-r from-sky-400 to-violet-500 bg-clip-text text-transparent"
              >
                ui
              </span>
              <span>list</span>
            </span>
          </NuxtLink>

          <UButton
            icon="i-heroicons-x-mark-20-solid"
            color="neutral"
            variant="ghost"
            size="xs"
            class="h-8 w-8 rounded-full border bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-600 dark:hover:bg-slate-800"
            aria-label="Close menu"
            @click="closeMobile"
          />
        </div>

        <!-- 内容 -->
        <div class="flex h-[calc(100%-3.5rem)] flex-col justify-between">
          <div class="space-y-4 overflow-y-auto px-4 py-4">
            <!-- Categories -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                Categories
              </p>

              <div class="space-y-1 rounded-lg bg-slate-100/80 p-1 dark:bg-slate-900/60">
                <NuxtLink
                  v-for="item in navItems"
                  :key="item.to"
                  :to="item.to"
                  class="flex items-center justify-between rounded-md px-3 py-2 text-sm"
                  :class="
                    isActive(item)
                      ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-50'
                      : 'text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
                  "
                  @click="closeMobile"
                >
                  <span>{{ item.label }}</span>
                  <span
                    v-if="item.isLive"
                    class="h-1.5 w-1.5 rounded-full bg-emerald-400"
                  />
                </NuxtLink>
              </div>
            </div>

            <UDivider />

            <!-- 用户信息 -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UAvatar
                    size="md"
                    class="bg-slate-200 dark:bg-slate-800"
                    text="oo"
                  />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium">
                      oozm
                    </span>
                    <span class="text-xs text-slate-500 dark:text-slate-500">@username</span>
                  </div>
                </div>
                <UButton
                  icon="i-heroicons-bell-20-solid"
                  color="neutral"
                  variant="ghost"
                  size="xs"
                  class="h-8 w-8 rounded-full border bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
                />
              </div>

              <div class="space-y-1 text-sm">
                <UButton
                  block
                  color="neutral"
                  variant="ghost"
                  class="justify-start rounded-md px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800"
                  icon="i-heroicons-user-20-solid"
                >
                  Your Profile
                </UButton>

                <UButton
                  block
                  color="neutral"
                  variant="ghost"
                  class="justify-start rounded-md px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800"
                  icon="i-heroicons-chat-bubble-left-right-20-solid"
                >
                  Send feedback
                </UButton>

                <UButton
                  block
                  color="neutral"
                  variant="ghost"
                  class="justify-start rounded-md px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800"
                  icon="i-simple-icons-discord"
                >
                  Join Discord
                </UButton>
              </div>
            </div>
          </div>

          <!-- 底部退出 -->
          <UButton
            block
            color="neutral"
            variant="ghost"
            class="flex items-center gap-2 rounded-none border-t px-4 py-3 justify-start text-sm text-slate-700 hover:bg-slate-200 border-slate-200 dark:text-slate-300 dark:hover:bg-slate-900 dark:border-slate-800"
            icon="i-heroicons-arrow-uturn-left-20-solid"
          >
            Log out
          </UButton>
        </div>
      </div>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const isMobileOpen = ref(false)

const navItems = [
  { label: 'Elements', to: '/elements' },
  { label: 'Challenges', to: '/challenges', isLive: true },
  { label: 'Spotlight', to: '/spotlight' },
  { label: 'Blog', to: '/blog' },
]

const colorMode = useColorMode()

const isDark = computed(() => colorMode.value === 'dark')

const toggleColorMode = () => {
  colorMode.preference = isDark.value ? 'light' : 'dark'
}

const isActive = (item: { to: string }) => {
  return route.path === item.to || route.path.startsWith(item.to + '/')
}

const closeMobile = () => {
  isMobileOpen.value = false
}
</script>
