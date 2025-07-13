<template>
  <div class="min-h-screen bg-gray-900">
    <NuxtPage />
  </div>
</template>

<script setup>
// Global head configuration
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
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
  ]
})
</script>