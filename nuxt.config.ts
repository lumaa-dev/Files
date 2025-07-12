// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-05-15',
  devtools: { enabled: true },
  modules: ['@nuxt/icon', '@nuxt/content'],
  css: ['@/public/assets/content.css'],

  content: {
    build: {
      markdown: {
        highlight: {
          theme: "github-dark"
        }
      }
    }
  }
})
