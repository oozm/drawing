import { sql } from 'drizzle-orm'
import { componentStats } from '../../../database/schema'
import { useDrizzle } from '../../../utils/db'

export default eventHandler(async (event) => {
  const componentId = getRouterParam(event, 'id')
  if (!componentId) return

  const db = useDrizzle()

  await db.insert(componentStats)
    .values({ componentId, views: 1 })
    .onConflictDoUpdate({
      target: componentStats.componentId,
      set: { views: sql`${componentStats.views} + 1` },
    })
    .run()

  return { ok: true }
})
