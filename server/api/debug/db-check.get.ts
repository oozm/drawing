import { sql } from 'drizzle-orm'
import { useDrizzle } from '~~/server/utils/db'
import { favorites } from '~~/server/database/schema'

export default eventHandler(async () => {
  try {
    const db = useDrizzle()

    // 1. Check if table exists
    const tableCheck = await db.run(sql`SELECT name FROM sqlite_master WHERE type='table' AND name='favorites';`)

    // 2. Try to select
    const result = await db.select().from(favorites).limit(1).all()

    return {
      status: 'ok',
      message: 'Database connection successful',
      tableExists: tableCheck.results.length > 0,
      data: result,
    }
  }
  catch (error: any) {
    return {
      status: 'error',
      message: error.message,
      stack: error.stack,
      details: error,
    }
  }
})
