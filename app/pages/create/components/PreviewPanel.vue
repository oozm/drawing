<template>
  <div class="flex-1 flex flex-col border border-gray-200 dark:border-gray-800 relative min-w-[300px] rounded-l-xl overflow-hidden">
    <div class="h-10 bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4">
      <span class="text-xs text-gray-500">Preview</span>
      <div class="flex items-center gap-2">
        <span class="text-xs text-gray-500 font-mono">{{ bgColor }}</span>
        <div class="flex px-2 items-center gap-2 bg-gray-200 dark:bg-gray-800 rounded p-0.5">
          <ColorPicker v-model="bgColor">
            <template #trigger="{ color }">
              <button
                type="button"
                class="w-5 h-5 rounded hover:scale-110 transition-transform border border-gray-600"
                :style="{ '--bg-color': color }"
              />
            </template>
          </ColorPicker>
          <!-- 主题切换 -->
          <UButton
            :icon="colorMode === 'light' ? 'i-lucide-moon' : 'i-lucide-sun'"
            :aria-label="`Switch to ${colorMode === 'light' ? 'light' : 'dark'} mode`"
            color="neutral"
            variant="ghost"
            class=" rounded-full"
            @click="toggleColorMode"
          />
        </div>
      </div>
    </div>

    <div class="flex-1 relative overflow-hidden">
      <iframe
        ref="previewRef"
        class="w-full h-full border-0"
        title="Code Preview Sandbox"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
interface CodeBlock { html: string, css: string }

const props = defineProps<{
  code: CodeBlock
  selectedTech: string
}>()

// Define Emits

const colorMode = ref('light')
const bgColor = ref('#e8e8e8')
const previewRef = ref<HTMLIFrameElement | null>(null)

const toggleColorMode = () => {
  colorMode.value = colorMode.value === 'light' ? 'dark' : 'light'
  bgColor.value = colorMode.value === 'light' ? '#e8e8e8' : '#000000'
  renderPreview()
}
/**
 * Renders the preview content into the iframe, implementing a style sandbox.
 */
const renderPreview = () => {
  const iframe = previewRef.value
  if (!iframe) return

  // contentDocument is available after iframe loads
  const doc = iframe.contentDocument
  if (!doc) return

  // 1. Dynamically inject CSS framework or custom styles
  let styles = ''
  if (props.selectedTech === 'Tailwind') {
    // Inject Tailwind CDN
    // Note: Use </` + `script> to prevent Vue/Nuxt template parser misinterpretation
    styles += `<script src="https://cdn.tailwindcss.com"></` + `script>`
  }
  else if (props.selectedTech === 'CSS') {
    // Inject custom CSS
    styles += `<style>${props.code.css}</style>`
  }

  // 2. Construct the complete HTML document
  const iframeContent = `
    <!doctype html>
    <html class="${colorMode.value}">
      <head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <!-- Dynamic styles/framework injection -->
        ${styles}
        <style>
          /* Base styles: Ensure content is centered and takes full iframe space */
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            /* 背景色由 props.bgColor 控制，这是唯一的颜色设置点 */
            background-color: ${bgColor.value};
            padding: 32px; /* Matches the original p-8 spacing */
            box-sizing: border-box;
          }
          /* Ensure user code elements can inherit body height/width */
          #preview-root {
            display: contents;
          }
        </style>
      </head>
      <body>
        <!-- User's HTML code -->
        <div id="preview-root">
          ${props.code.html}
        </div>
      </body>
    </html>
  `

  // 3. Write and close the document
  doc.open()
  doc.write(iframeContent)
  doc.close()
}
const emit = defineEmits(['update:bgColor'])
// Render on first mount
onMounted(() => {
  renderPreview()
})
watchEffect(() => {
  console.log('bgColor', bgColor.value)
  emit('update:bgColor', bgColor.value)
})

// Watch for changes in key dependencies, re-render automatically
watch([
  () => props.code.html,
  () => props.code.css,
  () => props.selectedTech,
  () => bgColor.value,
], () => {
  setTimeout(renderPreview, 50)
}, { deep: true })
</script>
