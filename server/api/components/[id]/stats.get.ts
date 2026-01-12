import { eq } from 'drizzle-orm'
import { useDrizzle } from '~~/server/utils/db'
import { componentStats } from '~~/server/database/schema'

export default eventHandler(async (event) => {
  const componentId = getRouterParam(event, 'id')
  if (!componentId) return { views: 0, favorites: 0 }

  try {
    const db = useDrizzle()
    const stats = await db.select().from(componentStats).where(eq(componentStats.componentId, componentId)).get()
    return stats || { views: 0, favorites: 0 }
  }
  catch (error) {
    console.error('Failed to fetch stats:', error)
    return { views: 0, favorites: 0 }
  }
})
