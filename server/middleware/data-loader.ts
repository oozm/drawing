// server/middleware/data-loader.ts
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // 1. 检查是否带有 Uiverse 风格的 _data 标识
  if (query._data === 'routes/$category' && !event.path.startsWith('/api/')) {
    const rawPath = event.path.split('?')[0] || ''
    const category = rawPath.replace('/', '') // 拿到 'buttons' 或 'elements'

    // 2. 内部重定向或直接调用逻辑
    // 我们直接在这里复用获取数据的逻辑
    const session = await getUserSession(event)
    const user = session?.user
    const pageSize = 30

    // 逻辑转换
    const isAll = category === 'elements'
    const formatType = (raw: string) => {
      const single = raw.endsWith('s') ? raw.slice(0, -1) : raw
      return single.charAt(0).toUpperCase() + single.slice(1)
    }
    const targetType = isAll ? null : formatType(category)
    const searchQ = (query.q as string || '').toLowerCase()

    try {
      const prefix = user ? `components/${user.id}/` : 'components/'
      const list = await hubBlob().list({ prefix, limit: 100 })

      const allComponents: any = list.blobs.map((blob: any) => {
        const filename = blob.pathname.split('/').pop() || ''
        const parts = filename.replace('.json', '').split('_')
        return {
          id: parts[1] || parts[0],
          type: parts[0] || 'Other',
          pathname: blob.pathname,
          title: ((parts[1] || parts[0]) || '').toUpperCase(),
        }
      })

      let filtered = isAll
        ? allComponents
        : allComponents.filter((c: any) => c.type.toLowerCase() === targetType?.toLowerCase())

      if (searchQ) {
        filtered = filtered.filter((c: any) =>
          c.title.toLowerCase().includes(searchQ)
          || c.type.toLowerCase().includes(searchQ),
        )
      }

      // 3. 关键：直接返回 JSON 并停止后续渲染
      return {
        components: filtered.slice(0, pageSize),
        hasMore: filtered.length > pageSize,
        nextCursor: list.cursor,
      }
    }
    catch (e) {
      console.log(e)

      throw createError({ statusCode: 500, message: 'Data intercept error' })
    }
  }
})
