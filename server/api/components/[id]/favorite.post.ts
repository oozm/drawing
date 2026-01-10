import { eq, and, sql } from 'drizzle-orm'
import { favorites, componentStats } from '../../../database/schema'
import { useDrizzle } from '../../../utils/db'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const componentId = getRouterParam(event, 'id')

  if (!componentId) {
    throw createError({ statusCode: 400, message: 'Missing component ID' })
  }

  const db = useDrizzle()

  // Check if already favorited
  const existing = await db.select().from(favorites).where(
    and(
      eq(favorites.userId, user.id),
      eq(favorites.componentId, componentId),
    ),
  ).get()

  if (existing) {
    // Unfavorite
    await db.delete(favorites).where(
      and(
        eq(favorites.userId, user.id),
        eq(favorites.componentId, componentId),
      ),
    )

    // Decrement stats
    // Note: In SQLite with Drizzle, upsert/update with sql works well
    try {
      await db.update(componentStats)
        .set({ favorites: sql`${componentStats.favorites} - 1` })
        .where(eq(componentStats.componentId, componentId))
        .run()
    }
    catch {
      // Ignore if stats don't exist (shouldn't happen if favorite exists)
    }

    return { favorited: false }
  }
  else {
    // Favorite
    await db.insert(favorites).values({
      userId: user.id,
      componentId,
      createdAt: new Date(),
    }).run()

    // Increment stats (upsert)
    await db.insert(componentStats)
      .values({ componentId, favorites: 1 })
      .onConflictDoUpdate({
        target: componentStats.componentId,
        set: { favorites: sql`${componentStats.favorites} + 1` },
      })
      .run()

    return { favorited: true }
  }
})
