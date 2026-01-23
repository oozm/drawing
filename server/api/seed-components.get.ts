export default eventHandler(async () => {
  const users = [
    { id: 'user_alice', name: 'Alice', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alice' },
    { id: 'user_bob', name: 'Bob', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Bob' }
  ]

  const components = [
    { type: 'Button', title: 'Alice Primary Button', html: '<button class="bg-blue-500 text-white px-4 py-2 rounded">Alice Button</button>', css: '' },
    { type: 'Card', title: 'Bob Simple Card', html: '<div class="p-4 border rounded shadow">Bob Card</div>', css: '' },
    { type: 'Input', title: 'Alice Input Field', html: '<input type="text" class="border p-2 rounded" placeholder="Alice Input" />', css: '' }
  ]

  const results = []

  for (const user of users) {
    for (const comp of components) {
      // 简单的 ID 生成
      const id = Math.random().toString(36).substring(7)
      const blobPath = `components/${user.id}/${comp.type}_${id}.json`
      
      const data = {
        ...comp,
        userId: user.id,
        username: user.name,
        avatar: user.avatar,
        lastUpdated: new Date().toISOString(),
        status: 1
      }

      await hubBlob().put(blobPath, JSON.stringify(data), {
        contentType: 'application/json',
        customMetadata: {
          title: comp.title,
          username: user.name,
          avatar: user.avatar,
          userId: user.id,
          type: comp.type
        }
      })
      
      results.push({ path: blobPath, status: 'created' })
    }
  }

  return {
    success: true,
    created: results
  }
})
