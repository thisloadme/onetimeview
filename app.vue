<template>
  <div class="app-shell min-h-[100dvh]">
    <NuxtPage />
  </div>
</template>

<script setup>
import faviconUrl from '~/assets/images/logo.ico'

useHead({
    title: 'OneTimeView - Notes with an ending',
  meta: [
    { name: 'title', content: 'OneTimeView - Notes with an ending' },
    { name: 'description', content: 'Write a markdown note, set its view and time limits, then share one link.' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { name: 'keywords', content: 'OneTimeView, temporary document sharing, markdown notes, limited access links' },
    { name: 'author', content: 'thisloadme' },
    { name: 'robots', content: 'index, follow' },
    { name: 'googlebot', content: 'index, follow' },
    { name: 'bingbot', content: 'index, follow' },

    // ⚠️ P3.11: OpenGraph meta tags for social media previews
    { property: 'og:title', content: 'OneTimeView - Notes with an ending' },
    { property: 'og:description', content: 'Write a markdown note, set its view and time limits, then share one link.' },
    { property: 'og:type', content: 'website' },
    { property: 'og:image', content: '/images/og-image.svg' },
    { property: 'og:image:width', content: '1200' },
    { property: 'og:image:height', content: '630' },
    { name: 'twitter:card', content: 'summary_large_image' },
    { name: 'twitter:title', content: 'OneTimeView - Notes with an ending' },
    { name: 'twitter:description', content: 'Write a markdown note, set its view and time limits, then share one link.' },
    { name: 'twitter:image', content: '/images/og-image.svg' },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: faviconUrl }]
})
</script>
