// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxthub/core',
    '@nuxt/ui',
    '@nuxt/eslint',
    'nuxt-auth-utils',
    'nuxt-monaco-editor',
  ],
  $development: {
    hub: {
      projectUrl: 'https://uilist.com',
    },
  },
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  vue: {
    compilerOptions: {
      isCustomElement: tag => tag.includes('component-preview'),
    },
  },
  colorMode: {
    preference: 'dark', // 默认偏好颜色模式
    fallback: 'dark', // 备用方案
  },
  ui: {
    fonts: false,
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-11-17',
  nitro: {
    preset: 'cloudflare-module',
    experimental: {
      openAPI: true,
    },
  },
  hub: {
    ai: true,
    blob: true,
    database: true,
  },
  hooks: {
    'nitro:config': (nitroConfig) => {
      nitroConfig.preset = 'cloudflare-module'
    },
  },
  // Development modules
  eslint: {
    config: {
      stylistic: {
        quotes: 'single',
      },
    },
  },
  monacoEditor: {
    // These are default values:
    locale: 'zh-hans',
    componentName: {
      codeEditor: 'MonacoEditor',
      diffEditor: 'MonacoDiffEditor',
    },
  },
})
