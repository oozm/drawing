<script setup lang="ts">
const { $api } = useNuxtApp()
interface Feedback {
  id: string
  message: string
  email: string
  uploadedAt: string
  user: {
    id: string
    name: string
    provider: string
  }
}
const message = ref('')
const email = ref('')
const loading = ref(false)
const toast = useToast()
const feedbacks = ref<Feedback[]>([])
async function submitFeedback() {
  if (!message.value.trim()) return

  loading.value = true
  try {
    await $api('/api/feedback', {
      method: 'POST',
      body: {
        message: message.value,
        email: email.value,
      },
    })
    toast.add({
      title: '感谢反馈！',
      description: '我们已经收到你的意见～',
      color: 'success',
    })
    message.value = ''
  }
  catch {
    // Global error handler
  }
  loading.value = false
}

async function getFeedbacks() {
  loading.value = true
  try {
    const data = await $api<{ feedbacks: Feedback[], cursor: string, hasMore: boolean }>('/api/feedback')
    feedbacks.value = data.feedbacks || [] as Feedback[]
    console.log('feedbacks', feedbacks.value)
  } catch {
     // Global error handler
  }
  loading.value = false
}
</script>

<template>
  <form
    class="space-y-3 max-w-[400px] mx-auto flex flex-col items-center justify-center mt-3"
    @submit.prevent="submitFeedback"
  >
    <UTextarea
      v-model="message"
      placeholder="写下你的建议或遇到的问题…"
      :rows="4"
    />
    <UInput
      v-model="email"
      placeholder="邮箱（可选，用于联系你）"
      type="email"
    />

    <UButton
      type="submit"
      :loading="loading"
      label="提交反馈"
    />
    <UButton
      type="button"
      :loading="loading"
      label="查看反馈"
      @click="getFeedbacks"
    />
    <div
      v-for="feedback in feedbacks"
      :key="feedback.id"
    >
      <p>{{ feedback.id }}</p>
      <p>{{ feedback.message }}</p>
      <p>{{ feedback.email }}</p>
      <p>{{ feedback?.uploadedAt }}</p>
    </div>
  </form>
</template>
