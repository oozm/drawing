// server/api/components/[category].get.ts
export default eventHandler(async (event) => {
  // 1. 提取动态路由参数与查询参数
  const categoryParam = getRouterParam(event, 'category') // 例如: 'elements', 'buttons'
  const query = getQuery(event)

  // 模拟 Uiverse 的请求校验：只允许带 _data 的合法请求，防止直接浏览器访问 API 导致的非预期行为
  if (query._data !== 'routes/$category') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request: Missing data identifier',
    })
  }

  // 2. 获取用户会话 (列表页允许游客访问)
  const session = await getUserSession(event)
  const user = session?.user

  // 3. 分页逻辑初始化
  const pageSize = 30
  const currentPage = parseInt(query.page as string || '1')
  const cursor = query.cursor as string
  const searchQ = (query.q as string || '').toLowerCase()

  // 4. 路由逻辑转换
  // 如果是 'elements'，则不进行类型过滤（显示全站/全个人组件）
  const isAll = categoryParam === 'elements'

  // 将路由中的复数形式转为组件定义的单数形式 (如 buttons -> Button)
  const formatType = (raw: string) => {
    if (!raw) return 'Other'
    const single = raw.endsWith('s') ? raw.slice(0, -1) : raw
    return single.charAt(0).toUpperCase() + single.slice(1)
  }
  const targetType = isAll ? null : formatType(categoryParam || '')

  // 5. 存储路径前缀
  // 逻辑：默认查看公共（所有），如果指定 scope=mine 且已登录，则只看自己的
  const scope = query.scope as string
  const prefix = (scope === 'mine' && user)
    ? `components/${user.id}/`
    : 'components/'

  try {
    // 获取 Blob 列表
    const list = await hubBlob().list({
      prefix,
      cursor,
      limit: 100, // 增加单次获取量以提高内存过滤后的数据命中率
    })

    // 解析 Blob 数据
    const allComponents: Array<{
      id: string
      title: string
      type: string
      pathname: string
      username: string
      userId: string
    }> = list.blobs.map((blob) => {
      const filename = blob.pathname.split('/').pop() || ''
      const nameWithoutExt = filename.replace('.json', '')
      const parts = nameWithoutExt.split('_')

      // 解析文件类型和 ID
      const fileType = parts[0] || 'Other'
      const fileId = (parts.length > 1 ? parts[1] : parts[0]) || ''

      return {
        id: fileId,
        title: fileId.toUpperCase(),
        type: fileType, // 例如 "Button"
        pathname: blob.pathname,
        username: user?.name || 'Community User',
        userId: user?.id || 'public',
      }
    })

    // 6. 执行分类过滤
    let filtered = isAll
      ? allComponents
      : allComponents.filter(c =>
          c.type && c.type.toLowerCase() === targetType?.toLowerCase(),
        )

    if (searchQ) {
      filtered = filtered.filter(c =>
        c.title.toLowerCase().includes(searchQ)
        || c.type.toLowerCase().includes(searchQ),
      )
    }

    // 7. 切片返回分页所需的 30 条数据
    const paginatedItems = filtered.slice(0, pageSize)

    return {
      components: paginatedItems,
      // 这里的 nextCursor 依然来自 Blob list 原生结果
      nextCursor: list.cursor,
      hasMore: list.hasMore,
      pagination: {
        page: currentPage,
        pageSize: pageSize,
        totalSize: filtered.length,
      },
      _metadata: {
        category: isAll ? 'all' : targetType,
        requestPath: categoryParam,
      },
    }
  }
  catch (e: any) {
    console.error(`[Blob List Error] for category ${categoryParam}:`, e.message)
    throw createError({
      statusCode: e.statusCode || 500,
      message: 'Failed to retrieve components from storage.',
    })
  }
})
