// server/api/resource/post/metadata/[id].get.ts
export default eventHandler(async (event) => {
  // 1. 获取会话 (如果详情页允许游客看，改用 getUserSession)
  const session = await getUserSession(event)
  const user = session?.user

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: '缺少组件 ID' })
  }

  // 2. 动态前缀：如果是登录用户查自己的，优先查自己；否则查公共目录
  const prefix = user ? `components/${user.id}/` : 'components/'

  try {
    // 3. 核心修复：因为文件名包含 Type (如 Button_id.json)，
    // 我们不能直接拼接，需要 list 之后 find 匹配 id 的那一个
    const list = await hubBlob().list({ prefix })
    const targetFile = list.blobs.find(blob => blob.pathname.includes(id))

    if (!targetFile) {
      throw createError({ statusCode: 404, statusMessage: `未找到 ID 为 ${id} 的组件` })
    }

    // 4. 获取文件内容
    const file = await hubBlob().get(targetFile.pathname)

    // NuxtHub Blob 处理优化
    const text = await file?.text() || '{}'
    const data = JSON.parse(text)

    // 5. 返回 Uiverse 风格的数据
    return {
      id: data.id || id,
      title: data.title || 'Untitled Component',
      html: data.html,
      css: data.css,
      type: data.type,
      user: {
        name: data.username || 'Anonymous',
        id: data.userId,
      },
      stats: {
        likes: data.likes || 0,
        views: data.views || 0,
      },
      _metadata: {
        lastUpdated: data.lastUpdated,
      },
    }
  }
  catch (e: any) {
    // 打印真实错误到终端，方便你调试
    console.error(`[Metadata Error for ${id}]:`, e.message)

    // 如果是 404 则转发，否则报 500
    throw createError({
      statusCode: e.statusCode || 500,
      statusMessage: e.statusMessage || '服务器内部错误',
    })
  }
})
