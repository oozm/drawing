import { createHash } from 'node:crypto'
import { eventHandler, readBody, createError } from 'h3'

type ComponentStatus = 0 | 1 | 2 | 3
type ComponentType = 'Input' | 'Button' | 'Select' | 'Card' | 'Modal' | 'Navigation' | 'Layout' | 'Other'

interface ComponentData {
  title: string
  html: string
  css: string
  techStack: 'Vue' | 'React' | 'Angular' | 'HTML' | 'Tailwind'
  type: ComponentType
  // 这里明确定义，即使 body 传了 status 也会被忽略
  status?: never
}

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readBody<ComponentData>(event)

  if (!body || !body.html || !body.type) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid component data.' })
  }

  // 根据内容生成固定 ID 的函数
  function generateContentId(userId: string, html: string, css: string) {
    return createHash('sha256')
      .update(`${userId}-${html}-${css}`)
      .digest('hex')
      .substring(0, 16)
  }

  // 1. 构造存储对象：关键在于 ...body 放在前面，强制字段放在后面
  const componentData = {
    ...body, // 包含前端传来的 title, html, css, type 等
    userId: user.id,
    lastUpdated: new Date().toISOString(),
    // 【核心防御】强制锁定状态为 1 (Pending)，前端传什么都没用
    status: 1 as ComponentStatus,
  }
  // 2. 生成唯一 ID
  const componentId = generateContentId(user.id, body.html, body.css)
  // 3. 构建路径
  const blobPath = `components/${user.id}/${body.type}_${componentId}.json`
  console.log('blobPath', blobPath)

  // --- 4. 安全检查：确保是新建，不是修改 ---
  try {
    // 尝试获取文件元数据
    const existing = await hubBlob().head(blobPath)

    // 如果没有抛出异常，说明文件已存在
    if (existing) {
      throw createError({
        statusCode: 409, // 使用 409 Conflict 更符合“资源已存在”的语义
        statusMessage: 'Component already exists. Duplicate submissions are not allowed.',
      })
    }
  }
  catch (e: any) {
    // 关键点：如果我们捕获到的是上面刚刚 throw 的 409 错误，必须再次 throw 出来
    // 这样才能阻止代码运行到下面的 hubBlob().put()
    if (e.statusCode === 409) {
      throw e
    }

    // 如果是 404，说明文件不存在，这是我们期望的，不做任何处理，让程序继续往下走
    if (e?.statusCode !== 404) {
      // 如果是其他错误（如网络问题），为了安全起见，建议也抛出错误阻止保存
      console.error('Check failed:', e)
      throw createError({ statusCode: 500, statusMessage: 'Storage check failed.' })
    }
  }
  try {
    // 5. 执行保存
    await hubBlob().put(
      blobPath,
      JSON.stringify(componentData, null, 2),
      { contentType: 'application/json' },
    )

    return {
      message: 'Submission received. Awaiting review.',
      code: 200,
    }
  }
  catch (error) {
    console.log(error)

    throw createError({ statusCode: 500, statusMessage: 'Save failed.' })
  }
})
