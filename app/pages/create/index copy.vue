<template>
  <div class="min-h-[calc(100vh-56px)] bg-black text-slate-50">
    <UContainer class="py-6">
      <div
        class="grid gap-4 rounded-2xl border border-slate-800 bg-slate-950/80 lg:grid-cols-2 overflow-hidden"
      >
        <!-- 预览 -->
        <UiPlaygroundPreview :code="code" />

        <!-- 编辑器 -->
        <UiPlaygroundEditor v-model:code="code" />
      </div>
    </UContainer>
  </div>
</template>

<script setup lang="ts">
import UiPlaygroundEditor from './components/UiPlaygroundEditor.vue'
import UiPlaygroundPreview from './components/UiPlaygroundPreview.vue'

const code = ref(`
<button
  class="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
>
  Button
</button>
`.trim())
</script>
