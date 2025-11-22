// 获取用户列表
export default eventHandler(async (event) => {
  const drawings = await hubBlob().list({
    prefix: 'drawings/',
    limit: 100,
  })
  const session = await requireUserSession(event)
  const { user } = session
  const users = [...new Set(drawings.blobs.map(drawing => drawing.customMetadata))]

  return {
    drawings: drawings.blobs,
    users: users,
    user: user,
  }
})
