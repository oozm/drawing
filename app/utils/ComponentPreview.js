// 重要的安全检查：确保代码只在浏览器环境中运行
if (typeof window !== 'undefined') {
  /**
   * ComponentPreview: 一个自定义元素，用于使用 Shadow DOM 隔离组件的 HTML 和 CSS。
   */
  class ComponentPreview extends HTMLElement {
    // 构造函数：创建 Shadow DOM
    constructor() {
      super()
      // 模式设为 'open' 以允许从外部脚本访问 Shadow DOM
      this.attachShadow({ mode: 'open' })
    }

    /**
     * 设置组件数据（HTML 和 CSS）的属性 setter。
     * @param data - 包含 html 和 css 字符串的对象
     */
    set componentData(data) {
      const { html, css } = data
      const shadowRoot = this.shadowRoot
      if (!shadowRoot) return

      // 清理旧内容
      shadowRoot.innerHTML = ''

      // 1. 应用 CSS 样式
      const style = document.createElement('style')
      style.textContent = css
      shadowRoot.appendChild(style)

      // 2. 应用 HTML 结构
      const wrapper = document.createElement('div')
      wrapper.innerHTML = html
      wrapper.style.display = 'contents' // 确保内容可以灵活布局

      shadowRoot.appendChild(wrapper)
    }
  }

  // 注册自定义元素 (确保只注册一次)
  if (!customElements.get('component-preview')) {
    customElements.define('component-preview', ComponentPreview)
  }

  // 导出类以便在 Vue 组件中进行类型和实例检查
  window.ComponentPreviewClass = ComponentPreview
}
