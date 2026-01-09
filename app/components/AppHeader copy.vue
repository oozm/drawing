<script setup>
import BaseButton from './BseButton.vue'

const { loggedIn, clear } = useUserSession()
const colorMode = useColorMode()

// Computed
const isDark = computed({
  get() {
    return colorMode.value === 'dark'
  },
  set() {
    colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
  },
})
</script>

<template>
  <header class="top-0 z-50 border-none md:pt-8 md:max-w-2xl mx-auto bg-transparent ">
    <UContainer class="flex items-center justify-between gap-3 h-16 md:rounded-full  border-(--ui-border-muted) bg-(--ui-bg-muted)  ">
      <BaseButton
        to="/"
        icon="i-lucide-image"
      />

      <BaseButton
        to="/draw"
        icon="i-ph-pencil"
      />
      <BaseButton
        v-if="loggedIn"
        color="neutral"
        variant="ghost"
        icon="i-ph-power"
        @click="clear"
      />
      <ClientOnly v-if="!colorMode?.forced">
        <BaseButton
          :icon="isDark ? 'i-lucide-moon' : 'i-lucide-sun'"
          :aria-label="`Switch to ${isDark ? 'light' : 'dark'} mode`"
          color="neutral"
          variant="ghost"
          @click="isDark = !isDark"
        />
      </ClientOnly>
    </UContainer>
  </header>
</template>
