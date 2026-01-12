// 定义代码结构类型
interface CodeBlock {
  html: string
  css: string
}

// 定义 Tailwind 默认代码
const tailwindPlaceholderCSS = `/* * 🎨 Tailwind CSS 启用。
 * 请在 HTML 标签的 class 属性中直接使用 Tailwind 工具类。
 * 此 CSS 文件不会被加载到预览中。
 */`

// 定义 CSS 默认代码
const cssPlaceholderHTML = (className: string) => `<${className === 'slider' ? 'label' : 'div'} class="${className}">
  ${className.charAt(0).toUpperCase() + className.slice(1)} Example
</${className === 'slider' ? 'label' : 'div'}>`
const cssPlaceholderCSS = (className: string) => `.${className} {
  /* 请在这里添加您的 CSS 样式 */
  padding: 12px 24px;
  background-color: #212121;
  color: white;
  border-radius: 8px;
  min-height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
}`

/**
 * 根据组件类型和技术栈加载代码模板
 * @param type 组件类型 (e.g., 'button', 'toggle')
 * @param tech 技术栈 (e.g., 'CSS', 'Tailwind')
 * @returns 包含 HTML 和 CSS 的对象
 */
export const loadTemplate = (type: string, tech: string): CodeBlock => {
  const code: CodeBlock = { html: '', css: '' }

  // --- Tailwind 模式的通用模板 ---
  if (tech === 'Tailwind') {
    code.css = tailwindPlaceholderCSS

    if (type === 'button') {
      code.html = `<button class="px-6 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg hover:bg-blue-700 transition duration-300 transform hover:scale-[1.02]">
  Tailwind Button
</button>`
    }
    else if (type === 'toggle') {
      code.html = `<label class="flex items-center space-x-2 cursor-pointer">
  <div class="relative">
    <input type="checkbox" class="hidden peer" />
    <div class="w-10 h-6 bg-gray-400 rounded-full peer-checked:bg-green-500 transition-colors duration-300"></div>
    <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform duration-300 peer-checked:translate-x-4 shadow-md"></div>
  </div>
  <span class="text-sm text-gray-700 dark:text-gray-300">Toggle Feature</span>
</label>`
    }
    else if (type === 'card') {
      code.html = `<div class="max-w-sm mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-6 space-y-4 border border-gray-200 dark:border-gray-700">
  <h2 class="text-xl font-bold text-gray-900 dark:text-white">Card Title</h2>
  <p class="text-gray-500 dark:text-gray-400">
    This is a Tailwind CSS Card example. All styles are applied directly using utility classes.
  </p>
  <button class="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition">Action</button>
</div>`
    }
    else {
      // 其他组件的 Tailwind 占位符
      const className = type
      code.html = `<div class="p-6 bg-gray-200 dark:bg-gray-700 rounded-lg shadow-md text-gray-800 dark:text-white font-medium">
  Tailwind ${className.charAt(0).toUpperCase() + className.slice(1)} Example
</div>`
    }
    return code
  }

  // --- CSS 模式的模板 ---

  if (type === 'button') {
    code.html = `<button class="botton">
  Button
</button>`
    code.css = `.botton {
  padding: 12px 24px;
  background-color: #212121;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  font-weight: bold;
  transition: all 0.2s;
}

.botton:hover {
  background-color: #333;
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}`
  }
  else if (type === 'toggle') {
    code.html = `<label class="switch">
  <input type="checkbox">
  <span class="slider"></span>
</label>`
    code.css = `.switch {
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
}

.switch input {
  opacity: 0;
  width: 0;
  height: 0;
}

.slider {
  position: absolute;
  cursor: pointer;
  inset: 0;
  background-color: #ccc;
  transition: .4s;
  border-radius: 34px;
}

.slider:before {
  position: absolute;
  content: "";
  height: 26px;
  width: 26px;
  left: 4px;
  bottom: 4px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .slider {
  background-color: #2196F3;
}

input:checked + .slider:before {
  transform: translateX(26px);
}`
  }
  // 简化其他组件的 CSS 模板，使用占位符
  else if (type === 'input') {
    code.html = `<input type="text" placeholder="Enter text..." class="input" />`
    code.css = cssPlaceholderCSS('input')
  }
  else if (type === 'card') {
    code.html = cssPlaceholderHTML('card')
    code.css = cssPlaceholderCSS('card')
  }
  else if (type === 'loader') {
    code.html = cssPlaceholderHTML('loader')
    code.css = cssPlaceholderCSS('loader')
  }
  else if (type === 'checkbox') {
    code.html = `<input type="checkbox" class="checkbox" />`
    code.css = cssPlaceholderCSS('checkbox')
  }
  else if (type === 'radio') {
    code.html = `<input type="radio" class="radio" />`
    code.css = cssPlaceholderCSS('radio')
  }
  else if (type === 'select') {
    code.html = `<select class="select"><option>Option 1</option></select>`
    code.css = cssPlaceholderCSS('select')
  }
  else if (type === 'textarea') {
    code.html = `<textarea class="textarea" placeholder="Multi-line text..."></textarea>`
    code.css = cssPlaceholderCSS('textarea')
  }
  else if (type === 'dropdown') {
    code.html = cssPlaceholderHTML('dropdown')
    code.css = cssPlaceholderCSS('dropdown')
  }
  else if (type === 'modal') {
    code.html = cssPlaceholderHTML('modal')
    code.css = cssPlaceholderCSS('modal')
  }
  else if (type === 'tooltip') {
    code.html = cssPlaceholderHTML('tooltip')
    code.css = cssPlaceholderCSS('tooltip')
  }

  // 默认返回基础卡片示例
  return code
}
