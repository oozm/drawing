import { sqliteTable, text, integer, primaryKey } from 'drizzle-orm/sqlite-core'

export const favorites = sqliteTable('favorites', {
  userId: text('userId').notNull(),
  componentId: text('componentId').notNull(),
  createdAt: integer('createdAt', { mode: 'timestamp' }).notNull(),
}, table => ({
  pk: primaryKey({ columns: [table.userId, table.componentId] }),
}))

export const componentStats = sqliteTable('component_stats', {
  componentId: text('componentId').primaryKey(),
  views: integer('views').default(0),
  favorites: integer('favorites').default(0),
})
