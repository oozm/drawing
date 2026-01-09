import { randomUUID, createHash } from 'node:crypto'
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
  const blobPath = `components/${user.id}/${componentId}.json`
  console.log('blobPath', blobPath)

  // 4. 安全检查：确保是新建，不是修改
  try {
    const existing = await hubBlob().head(blobPath)
    if (existing) {
      // 如果路径已存在，说明是修改操作，这里直接拒绝
      throw createError({
        statusCode: 403,
        statusMessage: 'This endpoint is for new submissions only. Modifications are not allowed.',
      })
    }
  }
  catch (e: any) {
    // 只有 404 (不存在) 才是正常的创建流程
    if (e?.statusCode !== 404) {
      console.error('Check failed:', e)
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
