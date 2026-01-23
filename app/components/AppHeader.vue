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
          <template
            v-for="item in navItems"
            :key="item.to"
          >
            <UPopover
              v-if="item.children"
              mode="hover"
              :open-delay="0"
              :close-delay="100"
              :popper="{ placement: 'bottom-start' }"
            >
              <UButton
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
                </span>
              </UButton>

              <template #content>
                <div class="w-[600px] p-4 bg-white dark:bg-zinc-900 rounded-xl shadow-xl border border-gray-100 dark:border-zinc-800">
                  <div class="grid grid-cols-2 gap-2">
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.to"
                      :to="child.to"
                      class="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-zinc-800/50 transition-colors group"
                    >
                      <UIcon
                        :name="child.icon"
                        class="w-5 h-5 text-gray-400 group-hover:text-primary-500 dark:text-gray-500 dark:group-hover:text-primary-400 transition-colors"
                      />
                      <div class="flex-1 flex items-center justify-between">
                        <span class="text-sm font-medium text-gray-700 dark:text-gray-200 group-hover:text-gray-900 dark:group-hover:text-white">
                          {{ child.label }}
                        </span>
                        <!-- <span v-if="child.count" class="text-xs text-gray-400 dark:text-gray-600">
                          {{ child.count }}
                        </span> -->
                      </div>
                    </NuxtLink>
                  </div>
                </div>
              </template>
            </UPopover>

            <UButton
              v-else
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
              </span>
            </UButton>
          </template>
        </nav>
      </div>

      <!-- 右侧：桌面 -->
      <div class="hidden items-center gap-3 md:flex">
        <!-- Create -->
        <UButton
          size="lg"
          label="Create"
          icon="i-lucide-plus"
          class="rounded-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white shadow-md shadow-fuchsia-500/30 hover:brightness-110 border-0"
          @click="handleCreate"
        />

        <!-- 主题切换 -->
        <!-- <ClientOnly v-if="!colorMode?.forced">
          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
            color="neutral"
            variant="ghost"
            class="rounded-full"
            @click="toggleColorMode"
          />
        </ClientOnly> -->
        <template v-if="loggedIn">
          <UDropdownMenu
            :items="userMenuItems"
          >
            <div>
              <UButton
                icon="i-ph-caret-down"
                color="neutral"
                variant="ghost"
                class="profile-name text-sm font-bold!"
              >
                {{ user?.name }}
                <UAvatar
                  v-if="user?.avatar"
                  size="sm"
                  class="cursor-pointer ring-2 ring-transparent hover:ring-primary-500 transition-all"
                  :src="user?.avatar"
                />
              </UButton>
            </div>
          </UDropdownMenu>
        </template>
        <LoginModal v-model="isLoginOpen" />
      </div>

      <!-- 移动端菜单按钮 -->
      <UButton
        class="flex h-9 w-9 items-center justify-center rounded-md border bg-slate-100 text-slate-900 border-slate-300 hover:border-slate-400 md:hidden dark:bg-black/60 dark:text-slate-100 dark:border-slate-500/60 dark:hover:border-slate-300"
        variant="link"
        color="neutral"
        size="lg"
        aria-label="Open menu"
        @click="isMobileOpen = !isMobileOpen"
      >
        <UIcon
          :name="isMobileOpen ? 'i-heroicons-x-mark-20-solid' : 'i-heroicons-bars-3-20-solid'"
          class="w-6 h-6"
        />
      </UButton>
    </div>

    <!-- 移动端抽屉菜单 -->
    <USlideover
      v-if="isMobileOpen"
      v-model:visible="isMobileOpen"
      side="right"
      :overlay="true"
      :overlay-transition="true"
      :transition="true"
      class="md:hidden"
    >
      <div class="flex h-full flex-col bg-white text-slate-900 dark:bg-black dark:text-slate-100">
        <!-- 内容 -->
        <div class="flex h-[calc(100%-3.5rem)] flex-col justify-between">
          <div class="space-y-4 overflow-y-auto px-4 py-4">
            <!-- Categories -->
            <div>
              <p class="mb-2 text-xs font-semibold uppercase text-slate-500 dark:text-slate-400">
                Categories
              </p>

              <div class="space-y-1 rounded-lg bg-slate-100/80 p-1 dark:bg-slate-900/60">
                <template
                  v-for="item in navItems"
                  :key="item.to"
                >
                  <!-- 如果有子菜单，直接展示所有子菜单项 -->
                  <template v-if="item.children">
                    <NuxtLink
                      v-for="child in item.children"
                      :key="child.to"
                      :to="child.to"
                      class="flex items-center justify-between rounded-md px-3 py-2 text-sm"
                      :class="
                        isActive(child)
                          ? 'bg-slate-200 text-slate-900 dark:bg-slate-700 dark:text-slate-50'
                          : 'text-slate-700 hover:bg-slate-200 dark:text-slate-300 dark:hover:bg-slate-800'
                      "
                      @click="closeMobile"
                    >
                      <div class="flex items-center gap-2">
                        <UIcon
                          :name="child.icon"
                          class="w-4 h-4 text-gray-500"
                        />
                        <span>{{ child.label }}</span>
                      </div>
                    </NuxtLink>
                  </template>

                  <!-- 没有子菜单的普通项 -->
                  <NuxtLink
                    v-else
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
                  </NuxtLink>
                </template>
              </div>
            </div>

            <UDivider />
            <!-- 用户信息 -->
            <div class="space-y-3">
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-3">
                  <UAvatar
                    v-if="user?.avatar"
                    size="sm"
                    class="cursor-pointer ring-2 ring-transparent hover:ring-primary-500 transition-all"
                    :src="user?.avatar"
                  />
                  <div class="flex flex-col">
                    <span class="text-sm font-medium">
                      {{ user?.name }}
                    </span>
                  </div>
                </div>
                <UButton
                  icon="i-heroicons-bell-20-solid"
                  color="neutral"
                  variant="ghost"
                  size="lg"
                  class="h-8 w-8 rounded-full border bg-slate-100 text-slate-700 border-slate-300 hover:bg-slate-200 dark:bg-slate-900 dark:text-slate-200 dark:border-slate-700 dark:hover:bg-slate-800"
                />
              </div>

              <div class="space-y-1 text-sm">
                <UButton
                  block
                  to="/profile"
                  color="neutral"
                  variant="ghost"
                  class="justify-start rounded-md px-3 py-2 hover:bg-slate-200 dark:hover:bg-slate-800"
                  icon="i-heroicons-user-20-solid"
                  @click="closeMobile"
                >
                  Your Profile
                </UButton>
              </div>
            </div>
          </div>

          <!-- 底部退出 -->
          <UButton
            color="neutral"
            variant="ghost"
            icon="i-heroicons-arrow-right-on-rectangle"
            label="Sign out"
            @click="handleLogout"
          />
        </div>
      </div>
    </USlideover>
  </header>
</template>

<script setup lang="ts">
const route = useRoute()
const isMobileOpen = ref(false)
const isLoginOpen = ref(false)
const { loggedIn, clear, user } = useUserSession()

const categories = [
  { label: 'All', icon: 'i-heroicons-book-open', to: '/elements', count: '' },
  { label: 'Buttons', icon: 'i-heroicons-play-circle', to: '/buttons', count: '2595' },
  { label: 'Checkboxes', icon: 'i-heroicons-check-circle', to: '/checkboxes', count: '315' },
  { label: 'Toggle switches', icon: 'i-heroicons-arrows-right-left', to: '/toggle', count: '425' },
  { label: 'Cards', icon: 'i-heroicons-square-2-stack', to: '/card', count: '1419' },
  { label: 'Loaders', icon: 'i-heroicons-arrow-path', to: '/loader', count: '1161' },
  { label: 'Inputs', icon: 'i-heroicons-pencil-square', to: '/input', count: '362' },
  { label: 'Radio buttons', icon: 'i-heroicons-list-bullet', to: '/radio', count: '194' },
  { label: 'Forms', icon: 'i-heroicons-clipboard-document-check', to: '/form', count: '246' },
  { label: 'My favorites', icon: 'i-heroicons-bookmark', to: '/my-favorites', count: '' },
]

const navItems = [
  {
    label: 'Elements',
    to: '/elements',
    children: categories,
  },
]
// 下拉菜单配置
const userMenuItems = ref<any>([
  [{
    label: user.value?.name || '--',
    avatar: {
      src: user.value?.avatar,
    },
    type: 'label',
  }],
  [{
    label: 'Profile',
    icon: 'i-heroicons-user',
    onSelect: () => navigateTo('/profile'),
  }, {
    label: 'Favorites',
    icon: 'i-heroicons-heart',
    onSelect: () => navigateTo('/my-favorites'),
  }],
  [{
    label: 'Settings',
    icon: 'i-heroicons-cog-8-tooth',
    onSelect: () => navigateTo('/settings'),
  }, {
    label: 'Sign out',
    icon: 'i-heroicons-arrow-left-on-rectangle',
    onSelect: () => clear(),
  }],
])
const handleLogout = async () => {
  await clear()
  navigateTo('/')
}
const handleCreate = () => {
  if (!loggedIn.value) {
    isLoginOpen.value = true
    return
  }
  navigateTo('/create')
}
// const colorMode = useColorMode()

// const isDark = computed(() => colorMode.value === 'dark')

// const toggleColorMode = () => {
//   colorMode.preference = isDark.value ? 'light' : 'dark'
// }

const isActive = (item: { to: string }) => {
  return route.path === item.to || route.path.startsWith(item.to + '/')
}

const closeMobile = () => {
  isMobileOpen.value = false
}
</script>
