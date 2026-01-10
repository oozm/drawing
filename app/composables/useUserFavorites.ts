export const useUserFavorites = () => {
  const { $api } = useNuxtApp()
  const { loggedIn } = useUserSession()
  const favorites = useState<Set<string>>('user-favorites', () => new Set())
  const initialized = useState('user-favorites-initialized', () => false)
  const pending = useState('user-favorites-pending', () => false)

  const fetchFavorites = async () => {
    if (!loggedIn.value) return
    if (initialized.value || pending.value) return

    pending.value = true
    try {
      const data = await $api<string[]>('/api/user/favorites')
      favorites.value = new Set(data)
      initialized.value = true
    }
    catch (e) {
      console.error('Failed to fetch favorites', e)
    }
    finally {
      pending.value = false
    }
  }

  const isFavorited = (id: string | number) => {
    return favorites.value.has(String(id))
  }

  const toggleFavorite = async (id: string | number) => {
    if (!loggedIn.value) return false

    const strId = String(id)
    const isFav = favorites.value.has(strId)

    // Optimistic update
    if (isFav) {
      favorites.value.delete(strId)
    }
    else {
      favorites.value.add(strId)
    }

    try {
      const res = await $api<{ favorited: boolean }>(`/api/components/${id}/favorite`, { method: 'POST' })
      // Sync with server response just in case
      if (res.favorited) {
        favorites.value.add(strId)
      }
      else {
        favorites.value.delete(strId)
      }
      return res.favorited
    }
    catch (e) {
      // Revert on error
      if (isFav) {
        favorites.value.add(strId)
      }
      else {
        favorites.value.delete(strId)
      }
      console.error('Failed to toggle favorite', e)
      throw e
    }
  }

  // Clear favorites on logout
  watch(loggedIn, (val) => {
    if (!val) {
      favorites.value.clear()
      initialized.value = false
    }
    else {
      fetchFavorites()
    }
  })

  return {
    favorites,
    fetchFavorites,
    isFavorited,
    toggleFavorite,
    initialized,
  }
}
