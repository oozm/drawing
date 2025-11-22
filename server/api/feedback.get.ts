// server/api/feedback.get.ts
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  // 简单判断：只有某个 id 或 provider 才能看
  // if (user.provider !== 'github') {
  //   throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  // }
  // 简单分页：?cursor=xxx
  const { cursor } = await getQuery<{ cursor?: string }>(event)

  // 1. 先列出 blob 列表
  const list = await hubBlob().list({
    prefix: 'feedback/',
    cursor,
    limit: 50, // 每次最多 50 条，按需调整
  })

  // 2. 逐个读取 json 内容
  const feedbacks = await Promise.all(
    list.blobs.map(async (blob) => {
      const file = await hubBlob().get(blob.pathname)
      // hubBlob().get 返回的是 Blob
      const text = await (file as Blob).text()
      const data = JSON.parse(text)

      return {
        ...data,
        // 也可以把 blob 自带的信息一起返回（方便排序 / 调试）
        pathname: blob.pathname,
        uploadedAt: blob.uploadedAt,
      }
    }),
  )

  // 3. 返回列表 + 分页信息
  return {
    feedbacks,
    cursor: list.cursor,
    hasMore: list.hasMore,
  }
})
