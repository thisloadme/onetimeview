<template>
  <div class="min-h-screen bg-gray-900 py-8">
    <div class="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="text-center mb-8">
        <h1 class="text-2xl font-bold text-gradient mb-2">OneTimeView</h1>
        <p class="text-gray-400">Secure document sharing</p>
      </div>

      <!-- ⚠️ P2.7: Restore AccessInfo Display -->
      <div v-if="accessInfo" class="card p-4 mb-6">
        <div class="flex items-center justify-between flex-wrap gap-3">
          <div class="flex items-center gap-4">
            <div class="flex items-center gap-2">
              <svg class="w-5 h-5 text-[#1d6477]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span class="text-sm text-gray-300">Views: {{ accessInfo.currentAccesses }} / {{ accessInfo.maxAccesses }}</span>
            </div>
            <div class="text-sm text-gray-400">Remaining: {{ accessInfo.remainingAccesses }}</div>
          </div>
          <div v-if="accessInfo.remainingAccesses === 0" class="text-sm text-red-400 font-medium px-3 py-1 bg-red-900/20 rounded-lg border border-red-800">
            Final view
          </div>
          <div v-else-if="accessInfo.remainingAccesses <= 3" class="text-sm text-yellow-400 font-medium px-3 py-1 bg-yellow-900/20 rounded-lg border border-yellow-800">
            {{ accessInfo.remainingAccesses }} view{{ accessInfo.remainingAccesses > 1 ? 's' : '' }} left
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
        <p class="text-gray-400 mb-6">This link may have expired or reached its maximum view limit.</p>
        <NuxtLink to="/" class="btn-primary">Go to Homepage</NuxtLink>
      </div>

      <!-- Loading State -->
      <div v-else class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <p class="text-gray-400">Loading document...</p>
      </div>

      <!-- Footer -->
      <div class="text-center mt-12 text-gray-600 text-sm">
        <p>Powered by <NuxtLink to="/" class="text-blue-400 hover:text-blue-300 font-medium">OneTimeView</NuxtLink> - Secure document sharing</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'
definePageMeta({ layout: false })

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
    if (err.statusCode === 404 || err.status === 404) {
      error.value = 'Document not found'
    } else if (err.statusCode === 403 || err.status === 403) {
      error.value = 'Access limit reached'
    } else {
      error.value = 'Unable to load document'
    }
  }
})

useHead({
  title: computed(() => document.value ? `${document.value.title} - OneTimeView` : 'OneTimeView'),
  meta: [{ name: 'robots', content: 'noindex, nofollow' }]
})
</script>
