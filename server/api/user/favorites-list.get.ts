import { eq } from 'drizzle-orm'
import { favorites } from '../../database/schema'
import { useDrizzle } from '../../utils/db'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = useDrizzle()

  // Get favorite IDs
  const favs = await db.select({
    componentId: favorites.componentId,
  }).from(favorites).where(eq(favorites.userId, user.id)).all()

  const ids = favs.map((f: { componentId: string }) => f.componentId)

  if (ids.length === 0) {
    return { components: [] }
  }

  // List all components to find matches
  // Note: Optimally we should store the blob path in favorites or use a better index
  const prefix = 'components/'
  const list = await hubBlob().list({ prefix, limit: 1000 })

  const validBlobs = list.blobs.filter((blob: any) => {
    const filename = blob.pathname.split('/').pop() || ''
    const parts = filename.replace('.json', '').split('_')
    const id = parts[1] || parts[0]
    return ids.includes(id)
  })

  // Fetch content
  const components = await Promise.all(validBlobs.map(async (blob: any) => {
    try {
      const file = await hubBlob().get(blob.pathname)
      const text = await file?.text() || '{}'
      const data = JSON.parse(text)

      const filename = blob.pathname.split('/').pop() || ''
      const parts = filename.replace('.json', '').split('_')
      const id = parts[1] || parts[0]
      const type = parts[0] || 'Other'

      return {
        id: data.id || id,
        title: data.title || type.toUpperCase(),
        type: data.type || type,
        username: data.username || 'Anonymous',
        html: data.html,
        css: data.css,
      }
    }
    catch {
      return null
    }
  }))

  return { components: components.filter(Boolean) }
})
