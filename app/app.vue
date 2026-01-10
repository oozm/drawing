<script setup lang="ts">
useSeoMeta({
  title: 'Create and share your components with uilist',
  description: 'Create and share your components with uilist. It\'s free and open source. Harnessing the power of Cloudflare R2 and Cloudflare AI to store and enhance your components. No sign up required. Join the community and start creating your own components today!',
  ogTitle: 'UI List',
  ogImage: 'https://assets.hub.nuxt.com/eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1cmwiOiJodHRwczovL3poYW9qcy5vb3ptLndvcmtlcnMuZGV2IiwiaWF0IjoxNzYzMzQ2OTUzfQ.P0i6OsBA0a-JWylFuVJF59dPCyOtzlyyRTCeHv_RGh0.jpg?theme=light',
  twitterCard: 'summary_large_image',
})
if (import.meta.server) {
  useHead({
    meta: [
      { name: 'google-site-verification', content: 'MCzMclnxDKiwD8zLAx7iQYVD_3roVPeEgsQ34TPPUMY' },
    ],
  })
}
</script>

<template>
  <UApp>
    <div class="w-full max-w-full! h-full flex flex-col">
      <AppHeader />
      <main class="flex-1">
        <NuxtPage />
      </main>
    </div>
  </UApp>
</template>
