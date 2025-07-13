// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxtjs/color-mode'
  ],
  colorMode: {
    preference: 'dark',
    fallback: 'dark',
    classSuffix: ''
  },
  css: ['~/assets/css/main.css'],
  runtimeConfig: {
    mongoUri: process.env.MONGO_URI || 'mongodb://localhost:27017/onetimeview',
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    public: {
      appName: 'OneTimeView'
    }
  },
  nitro: {
    plugins: ['~/server/plugins/database.ts']
  }
})