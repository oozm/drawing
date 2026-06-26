import type { Designer } from '~~/types/designer'

const MOCK_DESIGNERS: Designer[] = [
  {
    id: '1',
    name: '林晓雨',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=linxiaoyu',
    bio: '专注品牌视觉与插画设计，擅长将抽象概念转化为富有温度的视觉语言。',
    tags: ['品牌设计', '插画', 'UI'],
    coverImage: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&q=80',
    likes: 1284,
    portfolioUrl: 'https://dribbble.com/designer-lin',
  },
  {
    id: '2',
    name: '陈墨',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=chenmo',
    bio: '产品设计师，热衷于探索交互细节与无障碍设计，曾服务多家互联网大厂。',
    tags: ['产品设计', '交互', 'UI'],
    coverImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
    likes: 956,
    portfolioUrl: 'https://behance.net/chenmo',
  },
  {
    id: '3',
    name: '张一凡',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=zhangyifan',
    bio: '动效与视觉设计师，用 Motion 讲述产品故事，让界面拥有生命力。',
    tags: ['动效', '视觉', '3D'],
    coverImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=80',
    likes: 2103,
    portfolioUrl: 'https://dribbble.com/zhangyifan',
  },
  {
    id: '4',
    name: '王诗涵',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=wangshihan',
    bio: '设计系统架构师，致力于构建可扩展、一致性的企业级设计体系。',
    tags: ['设计系统', 'UI', '组件库'],
    coverImage: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&q=80',
    likes: 742,
    portfolioUrl: 'https://behance.net/wangshihan',
  },
  {
    id: '5',
    name: '李北辰',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=libeichen',
    bio: '全栈创意设计师，横跨 Web、移动端与印刷媒介，追求极简与功能之美。',
    tags: ['Web设计', '移动端', '印刷'],
    coverImage: 'https://images.unsplash.com/photo-1614850523459-c2f4c699c52e?w=800&q=80',
    likes: 1589,
    portfolioUrl: 'https://dribbble.com/libeichen',
  },
]

export default eventHandler(async (event) => {
  const { tag } = await getQuery<{ tag?: string }>(event)

  if (!tag) {
    return MOCK_DESIGNERS
  }

  return MOCK_DESIGNERS.filter(designer =>
    designer.tags.some(t => t.toLowerCase() === tag.toLowerCase()),
  )
})
