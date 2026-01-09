<template>
  <div class="bg-[#e8e8e8] flex items-center justify-center">
    <iframe
      ref="previewRef"
      class="w-full h-[420px] lg:h-[520px] border-0"
    />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  code: string
}>()

const previewRef = ref<HTMLIFrameElement | null>(null)

const renderPreview = () => {
  const iframe = previewRef.value
  if (!iframe) return
  const doc = iframe.contentDocument
  if (!doc) return

  doc.open()
  doc.write(`
    <!doctype html>
    <html>
      <head>
        <meta charset="utf-8" />
        <!-- Tailwind CDN -->
    <script src="https://cdn.tailwindcss.com"></` + `script>
        <style>
          body {
            margin: 0;
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            background: #e8e8e8;
          }
        </style>
        </head>
      <body>
        ${props.code}
      </body>
    </html>
  `)
  doc.close()
}

// 首次挂载时渲染一次
onMounted(() => {
  renderPreview()
})

// code 变化时重新渲染预览
watch(
  () => props.code,
  () => {
    renderPreview()
  },
)
</script>
