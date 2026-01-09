// server/api/components/index.get.ts
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)

  // 获取 URL 参数，模拟 Uiverse 的 _data 逻辑
  const query = getQuery(event)
  const type = query.type as string
  const cursor = query.cursor as string
  const limit = parseInt(query.limit as string || '20')

  // 这里的 prefix 动态对应 Uiverse 的 category
  const prefix = `components/${user.id}/`

  try {
    const list = await hubBlob().list({
      prefix,
      cursor,
      limit,
    })

    // 过滤逻辑：只返回基础 ID 信息
    // 这样做请求极快，因为不读取 Blob 内容，只读 metadata 列表
    const blobs = list.blobs

    // 如果指定了 type，由于 Blob list 不支持过滤内容，
    // 我们可以通过文件命名规范（如 type_id.json）或在 list 后轻量过滤
    const components = blobs.map((blob) => {
      const filename = blob.pathname.split('/').pop() || ''
      // 假设文件名格式为：Type_ID.json -> Button_123.json
      const [fileType, fileId] = filename.replace('.json', '').split('_')

      return {
        id: fileId || fileType, // 这里的 ID 供前端后续请求 metadata
        title: (fileId || fileType).toUpperCase(),
        type: fileType,
        pathname: blob.pathname,
        username: user.name,
        userId: user.id,
        userInfo: user,
      }
    })

    // 如果传了 type，进行内存过滤
    const filtered = type
      ? components.filter(c => c.type.toLowerCase() === type.toLowerCase())
      : components

    return {
      components: filtered,
      nextCursor: list.cursor,
      hasMore: list.hasMore,
      // 模拟 Uiverse 的额外元数据
      _metadata: {
        category: type || 'all',
        count: filtered.length,
      },
    }
  }
  catch (e) {
    console.log(e)
    throw createError({ statusCode: 500, message: 'Server Error' })
  }
})
