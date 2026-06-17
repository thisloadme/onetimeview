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
    jwtSecret: process.env.JWT_SECRET,
    public: {
      appName: 'OneTimeView',
      baseUrl: process.env.BASE_URL || 'http://localhost:3000'
    }
  },
  nitro: {
    // ⚠️ P1.2: HTTPS enforcement (redirect HTTP→HTTPS in production)
    // ⚠️ P1.3: Content Security Policy headers
    hooks: {
      'render:response': (response: any, { event }: { event: any }) => {
        // Only apply in production
        if (process.env.NODE_ENV !== 'production') return

        const url = getRequestURL(event)
        const host = getRequestHost(event)

        // P1.2: Redirect HTTP to HTTPS
        if (url.protocol === 'http:') {
          const httpsUrl = url.toString().replace(/^http:/, 'https:')
          response.headers = {
            ...response.headers,
            'Location': httpsUrl
          }
          response.statusCode = 301
          response.statusMessage = 'Moved Permanently'
          return
        }

        // P1.3: Add CSP headers for all responses
        response.headers = {
          ...response.headers,
          'Content-Security-Policy': [
            "default-src 'self'",
            "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
            "font-src 'self' https://fonts.gstatic.com",
            "img-src 'self' data: blob:",
            "connect-src 'self'",
            "frame-ancestors 'none'",
            "base-uri 'self'",
            "form-action 'self'"
          ].join('; '),
          'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'Referrer-Policy': 'strict-origin-when-cross-origin'
        }
      }
    }
  }
})
