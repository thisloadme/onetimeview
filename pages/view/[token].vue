<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gradient mb-2">
          OneTimeView
        </h1>
        <p class="text-gray-400">Secure document sharing</p>
      </div>

      <!-- Access Info -->
      <div v-if="accessInfo" class="card p-4 mb-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="flex items-center space-x-2">
              <svg class="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span class="text-sm text-gray-400">
                Views: {{ accessInfo.currentAccesses }} / {{ accessInfo.maxAccesses }}
              </span>
            </div>
            <div class="text-sm text-gray-400">
              Remaining: {{ accessInfo.remainingAccesses }}
            </div>
          </div>
          <div v-if="accessInfo.remainingAccesses === 0" class="text-sm text-red-400 font-medium">
            This was the final view
          </div>
        </div>
      </div>

      <!-- Document Content -->
      <div v-if="document" class="card overflow-hidden">
        <div class="p-8">
          <h1 class="text-3xl font-bold text-gray-100 mb-6">{{ document.title }}</h1>
          <div class="prose-dark" v-html="renderedContent"></div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-100 mb-2">{{ error }}</h3>
        <p class="text-gray-400 mb-6">
          This link may have expired or reached its maximum view limit.
        </p>
        <NuxtLink to="/" class="btn-primary">
          Go to Homepage
        </NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-else class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading document...</p>
      </div>

      <!-- Footer -->
      <div class="text-center mt-12 text-gray-600 text-sm">
        <p>
          Powered by
          <NuxtLink to="/" class="text-blue-400 hover:text-blue-300 font-medium">
            OneTimeView
          </NuxtLink>
          - Secure document sharing
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

definePageMeta({
  layout: false
})

const route = useRoute()
const token = route.params.token

const document = ref(null)
const accessInfo = ref(null)
const error = ref('')

const renderedContent = computed(() => {
  if (!document.value?.content) return ''
  return marked(document.value.content)
})

onMounted(async () => {
  try {
    const response = await $fetch(`/api/view/${token}`)
    document.value = response.document
    accessInfo.value = response.accessInfo
  } catch (err) {
    if (err.status === 404) {
      error.value = 'Document not found'
    } else if (err.status === 403) {
      error.value = 'Access limit reached'
    } else {
      error.value = 'Unable to load document'
    }
  }
})

// Set page title
useHead({
  title: computed(() => document.value ? `${document.value.title} - OneTimeView` : 'OneTimeView'),
  meta: [
    { name: 'robots', content: 'noindex, nofollow' }
  ]
})
</script>

<style scoped>
.prose h1 { @apply text-2xl font-bold text-gray-900 mb-4 mt-6; }
.prose h2 { @apply text-xl font-bold text-gray-900 mb-3 mt-5; }
.prose h3 { @apply text-lg font-bold text-gray-900 mb-2 mt-4; }
.prose p { @apply text-gray-700 mb-4 leading-relaxed; }
.prose ul { @apply list-disc list-inside mb-4 text-gray-700; }
.prose ol { @apply list-decimal list-inside mb-4 text-gray-700; }
.prose li { @apply mb-1; }
.prose a { @apply text-purple-600 hover:text-purple-800 underline; }
.prose strong { @apply font-bold text-gray-900; }
.prose em { @apply italic; }
.prose code { @apply bg-gray-100 px-2 py-1 rounded font-mono text-sm; }
.prose pre { @apply bg-gray-100 p-4 rounded-lg overflow-x-auto mb-4; }
.prose blockquote { @apply border-l-4 border-purple-500 pl-4 italic text-gray-600 mb-4; }
</style>