// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils'],
  css: ['~/assets/scss/main.scss'],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          // Ligne corrigée ci-dessous
          additionalData: '@use "~/assets/scss/_variables.scss" as *; @use "~/assets/scss/_mixins.scss" as *;',
        },
      },
    },
  },
  app: {
    head: {
      link: [
        // Lien vers le CDN Font Awesome
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' }
      ]
    }
  }
})