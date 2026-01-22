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
  bgColor?: string
  mode?: 'dark' | 'light'
}

export default eventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const body = await readBody<ComponentData>(event)

  if (!body || !body.html || !body.type) {
    throw createError({ statusCode: 400, statusMessage: 'Invalid component data.' })
  }

  // 根据内容生成固定 ID 的函数
  function generateContentId(userId: string, html: string, css: string, bgColor: string, mode: string) {
    return createHash('sha256')
      .update(`${userId}-${html}-${css}-${bgColor}-${mode}`)
      .digest('hex')
      .substring(0, 16)
  }

  // 1. 构造存储对象
  const componentData = {
    ...body,
    userId: user.id,
    username: user.name,
    avatar: user.avatar,
    lastUpdated: new Date().toISOString(),
    // 【核心防御】强制锁定状态为 1 (Pending)
    status: 1 as ComponentStatus,
  }

  // 2. 生成唯一 ID
  const componentId = generateContentId(user.id, body.html, body.css, body.bgColor || '', body.mode || 'dark')

  // 3. 构建路径
  const blobPath = `components/${user.id}/${body.type}_${componentId}.json`
  console.log('blobPath', blobPath)

  // --- 4. 安全检查：确保是新建，不是修改 ---
  try {
    const existing = await hubBlob().head(blobPath)
    if (existing) {
      throw createError({
        statusCode: 409,
        message: 'Component already exists. Duplicate submissions are not allowed.',
      })
    }
  }
  catch (e: any) {
    if (e.statusCode === 409) throw e
    if (e?.statusCode !== 404) {
      console.error('Check failed:', e)
      throw createError({ statusCode: 500, statusMessage: 'Storage check failed.' })
    }
  }

  try {
    // 5. 执行保存，同时写入自定义元数据以便列表页快速读取
    await hubBlob().put(
      blobPath,
      JSON.stringify(componentData, null, 2),
      {
        contentType: 'application/json',
        customMetadata: {
          title: body.title,
          username: user.name,
          avatar: user.avatar,
          userId: user.id,
          type: body.type
        }
      },
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
