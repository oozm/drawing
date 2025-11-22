// server/api/feedback.post.ts
export default eventHandler(async (event) => {
  // 1. 拿 body
  const body = await readBody<{
    message?: string
    email?: string
  }>(event)

  const message = body.message?.trim() || ''
  const email = body.email?.trim() || ''

  if (!message || message.length < 3) {
    throw createError({
      statusCode: 400,
      statusMessage: '反馈内容太短了',
    })
  }

  // 2. 尝试拿登录用户（没登录就算了）
  let user: any = null
  try {
    const session = await requireUserSession(event)
    user = session.user
  }
  catch {
    // 未登录也允许反馈
  }

  // 3. 组织要存的内容
  const feedbackId
    = (globalThis.crypto as any)?.randomUUID?.()
      || Date.now().toString(36)

  const feedback = {
    id: feedbackId,
    message,
    email: email || null,
    createdAt: new Date().toISOString(),
    user: user
      ? {
          id: user.id,
          name: user.name,
          provider: user.provider,
        }
      : null,
    userAgent: getHeader(event, 'user-agent') || '',
    ip: getHeader(event, 'cf-connecting-ip') || '', // Cloudflare 上会有
  }

  // 4. 存到 Blob（dev 在 .data/hub/blob，线上在 R2）
  await hubBlob().put(`feedback/${feedbackId}.json`, JSON.stringify(feedback), {
    contentType: 'application/json',
  })

  return { ok: true }
})
