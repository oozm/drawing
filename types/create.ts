// types/create.ts
export interface UiCategory {
  id: string
  label: string
  icon: string // 使用 iconify 图标名
}

export const CATEGORIES: UiCategory[] = [
  { id: 'button', label: 'Button', icon: 'i-ph-toggle-left-fill' }, // 示意图标
  { id: 'toggle', label: 'Toggle switch', icon: 'i-ph-toggle-right' },
  { id: 'checkbox', label: 'Checkbox', icon: 'i-ph-check-square' },
  { id: 'card', label: 'Card', icon: 'i-ph-cards' },
  { id: 'loader', label: 'Loader', icon: 'i-ph-spinner-gap' },
  { id: 'input', label: 'Input', icon: 'i-ph-textbox' },
  { id: 'tooltip', label: 'Tooltip', icon: 'i-ph-info' },
  { id: 'select', label: 'Select', icon: 'i-ph-caret-down' },
  { id: 'textarea', label: 'Textarea', icon: 'i-ph-text-t' },
  // ... 其他类型可以继续添加
]
