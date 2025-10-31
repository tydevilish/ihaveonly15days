// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  runtimeConfig: {
    public: {
      apiBase: '',
    },
  },
  modules: ['@nuxtjs/tailwindcss'],
  css: [
    '@mdi/font/css/materialdesignicons.min.css' , 
    '~/assets/css/global.css'
  ],
})