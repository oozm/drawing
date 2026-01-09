<template>
  <div class="flex-1 flex flex-col min-w-[300px] max-w-[50%] border-r border-t border-b border-gray-200 dark:border-gray-800 rounded-r-xl overflow-hidden">
    <div class="h-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex">
      <Button
        v-for="tab in (selectedTech === 'Tailwind' ? ['HTML'] : ['HTML', 'CSS'])"
        :key="tab"
        :class="[
          'px-4 text-xs font-bold flex items-center gap-2 border-r border-gray-200 dark:border-gray-800 cursor-pointer', // Tab 边框颜色
          // 6. 选中 Tab: 浅色模式为浅灰底，深色模式为深灰底
          activeTab === tab ? 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
          : 'text-gray-500 hover:bg-gray-100/50 dark:hover:bg-gray-800/50',
        ]"
        @click="emit('update:activeTab', tab)"
      >
        <!-- 【优化】根据技术栈调整 HTML 标签的显示内容 -->
        <UIcon
          :name="tab === 'HTML' ? 'i-ph-file-html' : 'i-ph-file-css-fill'"
          size="24"
        />

        <template v-if="tab === 'HTML'">
          HTML
          <span
            v-if="selectedTech === 'Tailwind'"
            class=" font-semibold ml-1 flex items-center gap-2"
          >
            +
            <UIcon
              name="i-ph-wind"
              class=" text-blue-500 dark:text-blue-400"
              size="24"
            />
            TailwindCSS
          </span>
        </template>
        <template v-else>
          {{ tab }}
        </template>
      </Button>
    </div>

    <div class="flex-1 relative">
      <ClientOnly>
        <!-- HTML 编辑器 (始终显示) -->
        <MonacoEditor
          v-if="activeTab === 'HTML'"
          :model-value="code.html"
          lang="html"
          :options="editorOptions"
          class="h-full w-full"
          @update:model-value="updateCode('html', $event)"
        />
        <!-- CSS 编辑器 (仅在 CSS 模式下显示) -->
        <MonacoEditor
          v-if="activeTab === 'CSS' && selectedTech === 'CSS'"
          :model-value="code.css"
          lang="css"
          :options="editorOptions"
          class="h-full w-full"
          @update:model-value="updateCode('css', $event)"
        />
        <!-- Tailwind 提示信息 (如果选中 CSS Tab 但技术栈是 Tailwind) -->
        <div
          v-if="activeTab === 'CSS' && selectedTech === 'Tailwind'"
          class="p-8 h-full flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900"
        >
          <UIcon
            name="i-ph-info-duotone"
            class="text-4xl mb-3 text-gray-400"
          />
          <p class="text-gray-500 dark:text-gray-400 text-center font-semibold">
            您已选择 TailwindCSS。
          </p>
          <p class="text-sm mt-2 text-gray-500 dark:text-gray-400">
            请在 HTML 标签中直接使用工具类进行样式编写。
          </p>
          <p class="text-xs mt-2 text-gray-500 dark:text-gray-600">
            此技术栈下，CSS 编辑器已被禁用。
          </p>
        </div>
      </ClientOnly>
    </div>
  </div>
</template>

<script setup lang="ts">
// 定义 Props
interface CodeBlock { html: string, css: string }

const props = defineProps<{
  activeTab: string
  code: CodeBlock
  selectedTech: string
  editorOptions: object
}>()

// 定义 Emits
const emit = defineEmits<{
  (e: 'update:activeTab', tab: string): void
  (e: 'update:code', code: CodeBlock): void
}>()

// 更新 code 对象中的特定属性
const updateCode = (key: 'html' | 'css', value: string) => {
  emit('update:code', { ...props.code, [key]: value })
}
</script>
