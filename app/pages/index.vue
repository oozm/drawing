<script setup lang="ts">
const searchQuery = ref('')
const selectedCategory = ref('all')

const handleSearch = () => {
  if (searchQuery.value.trim()) {
    navigateTo({
      path: '/elements',
      query: { q: searchQuery.value },
    })
  }
}

const categories = [
  { id: 'all', name: 'All Components', count: 1250 },
  { id: 'buttons', name: 'Buttons', count: 320 },
  { id: 'cards', name: 'Cards', count: 180 },
  { id: 'forms', name: 'Forms', count: 150 },
  { id: 'navigation', name: 'Navigation', count: 120 },
  { id: 'loaders', name: 'Loaders', count: 95 },
  { id: 'modals', name: 'Modals', count: 85 },
  { id: 'charts', name: 'Charts', count: 70 },
]

const featuredComponents = [
  {
    id: 1,
    name: 'Gradient Button',
    category: 'buttons',
    likes: 245,
    views: 1200,
    preview: '🎨',
  },
  {
    id: 2,
    name: 'Glassmorphism Card',
    category: 'cards',
    likes: 189,
    views: 890,
    preview: '💎',
  },
  {
    id: 3,
    name: 'Neumorphism Form',
    category: 'forms',
    likes: 156,
    views: 670,
    preview: '🔘',
  },
  {
    id: 4,
    name: 'Animated Loader',
    category: 'loaders',
    likes: 134,
    views: 520,
    preview: '⚡',
  },
  {
    id: 5,
    name: 'Dark Mode Toggle',
    category: 'buttons',
    likes: 198,
    views: 780,
    preview: '🌙',
  },
  {
    id: 6,
    name: 'Hover Card',
    category: 'cards',
    likes: 167,
    views: 650,
    preview: '🃏',
  },
]

const stats = [
  { label: 'Components', value: '1,250+' },
  { label: 'Contributors', value: '500+' },
  { label: 'Downloads', value: '50K+' },
  { label: 'Users', value: '25K+' },
]
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 transition-colors duration-300">
    <!-- Hero Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto text-center">
        <h1 class="text-5xl md:text-7xl font-bold text-slate-900 dark:text-white mb-6">
          The Largest Library of
          <span class="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Open-Source UI
          </span>
          Elements
        </h1>

        <p class="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-3xl mx-auto">
          Discover thousands of beautiful, customizable UI components created by our community.
          Copy, paste, and build faster than ever before.
        </p>

        <div class="flex justify-center mb-12">
          <div class="relative max-w-md w-full">
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 dark:text-slate-500 pointer-events-none">
              🔍
            </div>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search components..."
              class="w-full pl-12 pr-32 py-4 rounded-xl border border-slate-200 dark:border-slate-600 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
              @keydown.enter="handleSearch"
            >
            <button
              class="absolute right-2 top-1/2 transform -translate-y-1/2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:shadow-md transition-all font-medium text-sm"
              @click="handleSearch"
            >
              Search
            </button>
          </div>
        </div>

        <!-- Stats -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-2xl mx-auto">
          <div
            v-for="stat in stats"
            :key="stat.label"
            class="text-center"
          >
            <div class="text-3xl font-bold text-slate-900 dark:text-white">
              {{ stat.value }}
            </div>
            <div class="text-sm text-slate-600 dark:text-slate-400">
              {{ stat.label }}
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-16 px-4 sm:px-6 lg:px-8 bg-white/50 dark:bg-slate-800/50">
      <div class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-slate-900 dark:text-white mb-8 text-center">
          Browse by Category
        </h2>
        <div class="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
          <button
            v-for="category in categories"
            :key="category.id"
            :class="[
              'p-4 rounded-xl border-2 transition-all hover:shadow-lg',
              selectedCategory === category.id
                ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600',
            ]"
            @click="selectedCategory = category.id"
          >
            <div class="text-center">
              <div class="text-2xl mb-2 text-slate-900 dark:text-white">
                {{ category.name.charAt(0) }}
              </div>
              <div class="text-sm font-medium text-slate-900 dark:text-white">
                {{ category.name }}
              </div>
              <div class="text-xs text-slate-500 dark:text-slate-400">
                {{ category.count }}
              </div>
            </div>
          </button>
        </div>
      </div>
    </section>

    <!-- Featured Components -->
    <section class="py-16 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="flex items-center justify-between mb-8">
          <h2 class="text-3xl font-bold text-slate-900 dark:text-white">
            Featured Components
          </h2>
          <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
            View All →
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div
            v-for="component in featuredComponents"
            :key="component.id"
            class="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 p-6 hover:shadow-lg transition-all group cursor-pointer"
          >
            <div class="aspect-video bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 rounded-lg mb-4 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform">
              {{ component.preview }}
            </div>

            <div class="flex items-center justify-between mb-2">
              <h3 class="font-semibold text-slate-900 dark:text-white">
                {{ component.name }}
              </h3>
              <span class="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-1 rounded">
                {{ component.category }}
              </span>
            </div>

            <div class="flex items-center justify-between text-sm text-slate-500 dark:text-slate-400">
              <div class="flex items-center space-x-4">
                <span class="flex items-center space-x-1">
                  <span>❤️</span>
                  <span>{{ component.likes }}</span>
                </span>
                <span class="flex items-center space-x-1">
                  <span>👁️</span>
                  <span>{{ component.views }}</span>
                </span>
              </div>
              <button class="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
                Copy →
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-700 dark:to-purple-700">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-white mb-6">
          Ready to Build Something Amazing?
        </h2>
        <p class="text-xl text-blue-100 dark:text-blue-100 mb-8">
          Join thousands of developers who are already building faster with our community-driven UI components.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <button class="px-8 py-4 bg-white text-blue-600 dark:text-blue-600 rounded-xl hover:shadow-lg transition-all font-semibold hover:bg-slate-50">
            Start Exploring
          </button>
          <button class="px-8 py-4 bg-transparent border-2 border-white text-white rounded-xl hover:bg-white hover:text-blue-600 transition-all font-semibold">
            Contribute
          </button>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <AppFooter />
  </div>
</template>
