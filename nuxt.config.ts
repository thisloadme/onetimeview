// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-04-03',
  devtools: { enabled: false },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '~/assets/images/logo.ico' }
      ]
    }
  },
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
    dbHost: process.env.DB_HOST || 'localhost',
    dbPort: process.env.DB_PORT || '5432',
    dbDatabase: process.env.DB_DATABASE || 'onetimeview',
    dbUsername: process.env.DB_USERNAME || 'postgres',
    dbPassword: process.env.DB_PASSWORD || '',
    jwtSecret: process.env.JWT_SECRET || 'your-super-secret-jwt-key',
    public: {
      appName: 'OneTimeView'
    }
  },
  nitro: {
    plugins: ['~/server/plugins/database.ts']
  }
})