<template>
  <div class="bg-[#020617]">
    <div
      class="flex items-center justify-between px-3 py-2 border-b border-slate-800 text-xs text-slate-400"
    >
      <div class="flex items-center gap-2">
        <span class="font-semibold text-slate-100">
          HTML + TailwindCSS
        </span>
      </div>
      <span class="text-[10px]">Unsaved changes</span>
    </div>

    <MonacoEditor
      v-model="innerCode"
      lang="html"
      theme="dark"
      class="h-[380px] lg:h-[480px]"
    />
  </div>
</template>

<script setup lang="ts">
// v-model:code
const props = defineProps<{
  code: string
}>()

const emit = defineEmits<{
  'update:code': [value: string]
}>()

const innerCode = computed({
  get: () => props.code,
  set: (val: string) => emit('update:code', val),
})

/**
 * Tailwind 自动补全（示例）
 * 依赖 nuxt-monaco-editor 暴露的 useMonaco()
 * 文档：你项目里如果用的是别的名字，只要拿到 monaco 实例逻辑一样
 */
const monaco = ref<MonacoEditor | null>(null)
interface MonacoEditor {
  languages: {
    CompletionItemKind: {
      Keyword: number
    }
  }
}

// 简单的 tailwind class 列表，可以自己扩展 / 换成从文件读取
const TAILWIND_CLASSES = [
  // layout
  'flex', 'inline-flex', 'block', 'inline-block',
  'items-center', 'justify-center', 'justify-between',
  'relative', 'absolute', 'fixed',
  'right-0', 'right-1', 'right-2', 'right-3', 'right-4', 'right-5', 'right-6', 'right-7',
  'top-0', 'bottom-0',

  // spacing
  'p-2', 'p-3', 'p-4',
  'px-2', 'px-3', 'px-4',
  'py-1', 'py-2', 'py-3',

  // colors
  'bg-blue-500', 'bg-blue-600',
  'bg-slate-900', 'bg-slate-800',
  'text-white', 'text-slate-100', 'text-slate-900',

  // border / radius
  'rounded', 'rounded-md', 'rounded-lg', 'rounded-full',
  'border', 'border-slate-200', 'border-slate-700',

  // effects
  'shadow', 'shadow-md',
  'transition-colors', 'transition-all', 'duration-150', 'duration-200',

  // states
  'hover:bg-blue-600', 'hover:bg-slate-800',
]

onMounted(async () => {
  await nextTick()
  if (!monaco.value) return
  console.log('monaco', monaco.value)

  // 注册一次即可
  ;(monaco.value as any).languages.registerCompletionItemProvider('html', {
    triggerCharacters: ['"', ' ', '-', ':'],
    provideCompletionItems(model: any, position: any) {
      const textUntilPosition = model.getValueInRange({
        startLineNumber: position.lineNumber,
        startColumn: 1,
        endLineNumber: position.lineNumber,
        endColumn: position.column,
      })
      console.log('textUntilPosition', textUntilPosition)

      // 只在 class="..." 里触发
      if (!/class\s*=\s*"[^"]*$/.test(textUntilPosition)) {
        return { suggestions: [] }
      }

      const match = textUntilPosition.match(/class\s*=\s*"([^"]*)$/)
      const classContent = match ? match[1] : ''
      const lastPart = classContent.split(/\s+/).pop() || ''

      const suggestions = TAILWIND_CLASSES
        .filter(c => c.startsWith(lastPart))
        .map(c => ({
          label: c,
          kind: monaco.value?.languages.CompletionItemKind.Keyword,
          insertText: c,
          range: {
            startLineNumber: position.lineNumber,
            endLineNumber: position.lineNumber,
            startColumn: position.column - lastPart.length,
            endColumn: position.column,
          },
        }))
      console.log('suggestions', suggestions)
      return { suggestions }
    },
  })
})
</script>
