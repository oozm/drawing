export default eventHandler(async (event) => {
  const { pathname } = event.context.params || {}

  const raw = Array.isArray(pathname) ? pathname.join('/') : pathname
  if (!raw) {
    throw createError({ statusCode: 404, statusMessage: 'Not Found' })
  }
  return hubBlob().serve(event, raw)
})
