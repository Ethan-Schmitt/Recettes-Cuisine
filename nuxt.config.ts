// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  srcDir: 'app/',
  modules: ['@nuxt/eslint', '@nuxt/image', '@nuxt/test-utils', '@nuxtjs/sanity'],
  css: ['~/assets/scss/main.scss'],
    
  image: {
    dir: '../public'
  },
  
  sanity: {
    projectId: 'pv51b7bd',
    dataset: 'production',
    visualEditing:{
      token: process.env.NUXT_SANITY_API_TOKEN,
      studioUrl: process.env.NUXT_SANITY_STUDIO_URL,
      stega: false 
    }
  },
  
  vite: {
     optimizeDeps: {
      include: ['react-compiler-runtime', 'react', 'react-dom']
    },
    css: {
      preprocessorOptions: {
        scss: {
         
          additionalData: '@use "~/assets/scss/_variables.scss" as *; @use "~/assets/scss/_mixins.scss" as *;',
        },
      },
    },
  },
  app: {
    head: {
      link: [
        // 1. Lien vers le CDN Font Awesome (déjà présent)
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css' },

        // 2. Importation des polices Montserrat (Bold) et Roboto (Regular)
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        { 
          rel: 'stylesheet', 
          href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@700&family=Roboto:wght@400;700&display=swap' 
        },
      ]
    }
  },
 
  runtimeConfig: {
    public: {
      apiUrl: 'http://localhost:2000' 
    }
  }
})