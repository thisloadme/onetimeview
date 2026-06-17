<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-16 px-4">
    <div class="max-w-lg w-full text-center">
      <div class="mb-8">
        <svg class="w-24 h-24 text-[#1d6477] mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h1 class="text-6xl font-bold text-white mb-4">404</h1>
        <h2 class="text-2xl font-semibold text-gray-300 mb-4">Page not found</h2>
        <p class="text-gray-400 mb-8 max-w-md mx-auto">
          The page you're looking for doesn't exist or has been moved.
          The link may have expired or the document may have been deleted.
        </p>
      </div>
      <div class="flex flex-col sm:flex-row gap-4 justify-center">
        <NuxtLink to="/" class="px-6 py-3 bg-[#0e2e4f] text-white font-semibold rounded-xl hover:bg-[#1d6477] transition-all">
          Go to Homepage
        </NuxtLink>
        <NuxtLink to="/create-anonymous" class="px-6 py-3 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
          Create a Document
        </NuxtLink>
      </div>
    </div>
  </div>
</template>

<script setup>
useHead({
  title: '404 - Page Not Found - OneTimeView',
  meta: [{ name: 'robots', content: 'noindex' }]
})
</script>
