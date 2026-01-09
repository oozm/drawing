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
      projectUrl() {
        return 'https://uilist.com'
      },
    },
  },
  devtools: { enabled: true },
  css: ['~/assets/main.css'],
  ui: {
    fonts: false,
  },
  future: { compatibilityVersion: 4 },
  compatibilityDate: '2025-11-17',
  nitro: {
    experimental: {
      openAPI: true,
    },
  },
  hub: {
    ai: true,
    blob: true,
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