<template>
  <div class="min-h-screen bg-gray-900">
    <NuxtPage />
  </div>
</template>

<script setup>
// Global head configuration
useHead({
  title: 'OneTimeView - Secure Markdown Sharing',
  meta: [
    { name: 'description', content: 'Share markdown content with limited access links. Perfect for secure, temporary document sharing.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
  ],
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap' }
  ]
})
</script>