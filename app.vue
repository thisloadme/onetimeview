<template>
  <div class="min-h-screen bg-gray-900">
    <NuxtPage />
  </div>
</template>

<script setup>
useHead({
  title: 'OneTimeView - Secure Document Sharing Platform',
  meta: [
    { name: 'title', content: 'OneTimeView - Secure Document Sharing Platform' },
    { name: 'description', content: 'Share markdown content with limited access links. Perfect for secure, temporary document sharing. Perfect for consultants, HR professionals, researchers, and developers who need secure, controlled document sharing.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'keywords', content: 'OneTimeView, secure document sharing, markdown sharing, markdown SaaS, limited access links, consultants, HR professionals, researchers, developers' },
    { name: 'author', content: 'thisloadme' },
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
    { name: 'bingbot', content: 'index, follow' },

    // ⚠️ P3.11: OpenGraph meta tags for social media previews
    { property: 'og:title', content: 'OneTimeView - Secure Document Sharing Platform' },
    { property: 'og:description', content: 'Share documents with limited-access links that automatically expire. Secure, simple, and private.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/images/og-image.svg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'OneTimeView - Secure Document Sharing' },
    { name: 'twitter:description', content: 'Share documents with limited-access links that automatically expire.' },
    { name: 'twitter:image', content: '/images/og-image.svg' },
  ]
})
</script>
