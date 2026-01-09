// composables/useComponents.ts
export const useComponents = () => {
  const components = ref([])
  const loading = ref(false)
  const hasMore = ref(true)
  const nextCursor = ref(null)
  const error = ref(null)

  const fetchList = async (apiType: string | null, reset = false) => {
    loading.value = true
    const cursor = reset ? null : nextCursor.value

    const query = new URLSearchParams({
      limit: '20',
      ...(apiType && { type: apiType }),
      ...(cursor && { cursor }),
    })

    try {
      const res = await fetch(`/api/components/list?${query.toString()}`)
      if (!res.ok) throw new Error('Failed to fetch')
      const data = await res.json()

      components.value = reset ? data.components : [...components.value, ...data.components]
      nextCursor.value = data.nextCursor
      hasMore.value = data.hasMore
    }
    catch (err: any) {
      error.value = err.message
    }
    finally {
      loading.value = false
    }
  }

  return { components, loading, hasMore, error, fetchList }
}
