import { eq } from 'drizzle-orm'
import { favorites } from '../../database/schema'
import { useDrizzle } from '../../utils/db'

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const db = useDrizzle()

  const userFavorites = await db.select({
    componentId: favorites.componentId,
  }).from(favorites).where(eq(favorites.userId, user.id)).all()

  return userFavorites.map((f: { componentId: string }) => f.componentId)
})
