// plugins/api-client.ts
export default defineNuxtPlugin(() => {
  const toast = useToast()

  const apiFetch = $fetch.create({
    // 请求拦截
    onRequest({ options }) {
      console.log(options)
      // 可以在这里统一注入 Token 等
      // options.headers = { ...options.headers, Authorization: '...' }
    },

    // 响应错误拦截 (4xx, 5xx)
    onResponseError({ response }) {
      console.log('Global API Error Interceptor:', response)
      const message = response._data?.message || response._data?.statusMessage || '系统繁忙，请稍后再试'

      // 弹出错误提醒
      toast.add({
        title: '请求错误',
        description: message,
        color: 'error',
        icon: 'i-heroicons-exclamation-circle',
      })
    },

    // 业务逻辑拦截 (即使是 200 OK，但业务 code 不对)
    onResponse({ response }) {
      // 针对你之前提到的“重复提交”返回 200 的逻辑
      if (response._data?.status === 'duplicate') {
        toast.add({
          title: '温馨提示',
          description: response._data.message,
          color: 'warning',
          icon: 'i-heroicons-information-circle',
        })
      }
    },
  })

  // 将这个自定义 fetch 注入到全局，使用时用 $api 即可
  return {
    provide: {
      api: apiFetch,
    },
  }
})
