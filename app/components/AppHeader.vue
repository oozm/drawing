<template>
  <!-- header 本身支持明/暗 -->
  <header
    class="sticky top-0 z-30 bg-white/80 text-slate-900 backdrop-blur  dark:bg-black/80 dark:text-slate-50 dark:border-slate-800"
  >
    <div class="flex px-5 py-3 h-14 items-center justify-between">
      <div class="flex items-center justify-between" />

      <!-- 右侧：桌面 -->
      <div class="hidden items-center gap-3 md:flex">
        <!-- 主题切换 -->
        <ClientOnly v-if="!colorMode?.forced">
          <UButton
            :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
            :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
            color="neutral"
            variant="ghost"
            class="rounded-full"
            @click="toggleColorMode"
          />
        </ClientOnly>
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
    </div>
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
