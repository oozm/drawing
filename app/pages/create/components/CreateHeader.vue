<template>
  <!-- 2. 顶部 Header: 浅色背景和深色文字/边框 -->
  <header class="h-14 border-b bg-gray-50 rounded-xl shadow-sm border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 dark:bg-gray-900/75 backdrop-blur z-10">
    <div class="flex items-center gap-4">
      <UBadge
        color="neutral"
        variant="soft"
      >
        <!-- 显示类型和技术栈 -->
        {{ currentTypeLabel }}
      </UBadge>
    </div>
    <div class="flex items-center gap-2">
      <CreationModal
        @select="emit('select', $event)"
      />
      <UButton
        color="neutral"
        variant="ghost"
        icon="i-ph-floppy-disk"
        class="w-[120px] h-12"
      >
        Save draft
      </UButton>
      <UButton
        color="primary"
        @click="handleSubmit"
      >
        Submit
      </UButton>
    </div>
  </header>
</template>

<script setup lang="ts">
const { $api } = useNuxtApp()
const toast = useToast()
// 定义 Props
const props = defineProps<{
  currentTypeLabel: string
  code: {
    html: string
    css: string
  }
  techStack: string
  type: string
  bgColor: string
  mode: string
}>()

const handleSubmit = async () => {
  console.log('props', props)

  try {
    await $api(`/api/components/submit`, {
      method: 'POST',
      body: {
        title: props.currentTypeLabel,
        html: props.code.html,
        bgColor: props.bgColor,
        css: props.code.css,
        techStack: props.techStack,
        type: props.type,
        mode: props.mode,
      },
    })
    toast.add({
      color: 'success',
      title: 'Component submitted successfully',
    })
  }
  catch (e) {
    console.log('Failed to submit', e)
  }
}
// 定义 Emits
const emit = defineEmits<{
  (e: 'select', selection: { category: string, tech: string }): void
}>()
</script>
