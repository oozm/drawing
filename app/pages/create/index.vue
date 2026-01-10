<template>
  <!-- 1. 主容器: 浅色模式为白色，深色模式为深黑 (bg-gray-950) -->
  <div class="h-full flex flex-col bg-white dark:bg-gray-950 p-4 ">
    <!-- 2. 顶部 Header: 浅色背景和深色文字/边框 -->
    <CreateHeader
      v-model:current-type-label="currentTypeLabel"
      v-model:selected-tech="selectedTech"
      :code="code"
      :bg-color="bgColor"
      :tech-stack="selectedTech"
      :type="currentType"
      @select="handleInit"
    />

    <!-- ... 在 pages/create.vue 的模板中 ... -->
    <div class="flex-1 flex overflow-hidden mt-4">
      <!-- 左侧预览区组件 (PreviewPanel) -->
      <PreviewPanel
        :code="code"
        :selected-tech="selectedTech"
        @update:bg-color="bgColor = $event"
      />
      <EditorPanel
        v-model:active-tab="activeTab"
        v-model:code="code"
        :selected-tech="selectedTech"
        :editor-options="editorOptions"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { CATEGORIES } from '../../../types/create'
import CreateHeader from './components/CreateHeader.vue'
import PreviewPanel from './components/PreviewPanel.vue'
import EditorPanel from './components/EditorPanel.vue'
import { loadTemplate } from '~/utils/index'

// --- State ---
const activeTab = ref('CSS')
const bgColor = ref('')

const colorMode = useColorMode()
const isDark = computed(() => colorMode.value === 'dark')

const currentTypeLabel = ref()
const currentType = ref('button')
const selectedTech = ref('CSS') // 【新增】用于记录当前选择的技术栈

// 代码内容
const code = ref({
  html: '',
  css: '',
})

// Monaco 配置: 使用 computed 确保主题响应 isDark 变化
const editorOptions = computed(() => ({
  theme: isDark.value ? 'vs-dark' : 'vs-light',
  fontSize: 14,
  minimap: { enabled: false },
  padding: { top: 16 },
  fontFamily: 'JetBrains Mono, Menlo, monospace',
  scrollBeyondLastLine: false,
}))
// --- Logic ---

// 处理初始选择
const handleInit = (selection: { category: string, tech: string }) => {
  const cat = CATEGORIES.find(c => c.id === selection.category)

  // 更新状态
  selectedTech.value = selection.tech // 记录当前技术栈
  currentType.value = selection.category
  currentTypeLabel.value = cat ? `${cat.label} / ${selection.tech}` : `Element / ${selection.tech}`

  // 切换 Tab
  if (selection.tech === 'Tailwind') {
    activeTab.value = 'HTML'
  }
  else {
    activeTab.value = 'CSS'
  }

  // 根据选择预填充模板 (Template)
  const template = loadTemplate(selection.category, selection.tech) // 【更新】传递 tech
  code.value.html = template.html
  code.value.css = template.css
}

// 默认加载一次初始模板
onMounted(() => {
  // 假设初始类型为 'button'，技术栈为 'CSS'
  const template = loadTemplate('button', 'CSS')
  code.value.html = template.html
  code.value.css = template.css
  const cat = CATEGORIES.find(c => c.id === 'button')
  currentTypeLabel.value = cat ? `${cat.label} / CSS` : 'Element / CSS'
})
</script>

<style scoped>
/* 确保 Monaco 编辑器高度正确 */
:deep(.monaco-editor) {
  height: 100% !important;
}
</style>
