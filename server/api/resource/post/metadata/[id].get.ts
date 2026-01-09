// server/api/resource/post/metadata/[id].get.ts
export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const id = getRouterParam(event, 'id')

  // 构建 Blob 路径
  const pathname = `components/${user.id}/${id}.json`

  try {
    const file = await hubBlob().get(pathname)
    if (!file) {
      throw createError({ statusCode: 404, statusMessage: '未找到组件元数据' })
    }

    const text = await (file as Blob).text()
    const data = JSON.parse(text)

    // 返回 Uiverse 风格的元数据包
    return {
      id: data.id,
      html: data.html,
      css: data.css,
      likes: Math.floor(Math.random() * 1000), // 实际应从数据库读取
      views: Math.floor(Math.random() * 5000),
    }
  }
  catch (e) {
    throw createError({ statusCode: 500, statusMessage: '详情读取失败' })
  }
})
