<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation -->
    <nav class="nav-bg border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard" class="text-2xl font-bold text-gradient">
              OneTimeView
            </NuxtLink>
            <span class="text-gray-600">/</span>
            <span class="text-gray-300">Edit Document</span>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="saveDocument" :disabled="saving" class="btn-primary">
              {{ saving ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-16">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
        <p class="text-gray-400 mt-4">Loading document...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-16">
        <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-100 mb-2">Document Not Found</h3>
        <p class="text-gray-400 mb-6">{{ error }}</p>
        <NuxtLink to="/dashboard" class="btn-primary">
          Back to Dashboard
        </NuxtLink>
      </div>

      <!-- Edit Form -->
      <div v-else class="card overflow-hidden">
        <!-- Title Input -->
        <div class="p-6 border-b border-gray-700">
          <input
            v-model="document.title"
            type="text"
            placeholder="Document title..."
            class="w-full text-2xl font-bold text-gray-100 bg-transparent border-none outline-none resize-none placeholder-gray-500"
          />
        </div>

        <!-- Editor and Preview -->
        <div class="grid md:grid-cols-2 min-h-96">
          <!-- Editor -->
          <div class="border-r border-gray-700">
            <div class="p-4 bg-gray-900 border-b border-gray-700">
              <h3 class="font-medium text-gray-100">Editor</h3>
            </div>
            <textarea
              v-model="document.content"
              placeholder="Start writing your markdown content here...

# Heading 1
## Heading 2

**Bold text** and *italic text*

- List item 1
- List item 2

[Link text](https://example.com)

```javascript
// Code block
console.log('Hello World!');
```"
              class="w-full h-96 p-6 bg-gray-800 border-none outline-none resize-none font-mono text-sm leading-relaxed text-gray-200 placeholder-gray-500"
            ></textarea>
          </div>

          <!-- Preview -->
          <div>
            <div class="p-4 bg-gray-900 border-b border-gray-700">
              <h3 class="font-medium text-gray-100">Preview</h3>
            </div>
            <div class="p-6 h-96 overflow-y-auto prose-dark" v-html="renderedMarkdown"></div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="saved" class="mt-4 p-4 bg-green-900/20 border border-green-800 rounded-lg">
        <div class="flex items-center">
          <svg class="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-green-400">Document updated successfully!</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { marked } from 'marked'

definePageMeta({
  middleware: 'auth'
})

const route = useRoute()
const documentId = route.params.id

const document = reactive({
  title: '',
  content: ''
})

const loading = ref(true)
const saving = ref(false)
const saved = ref(false)
const error = ref('')

const renderedMarkdown = computed(() => {
  if (!document.content) return '<p class="text-gray-500">Preview will appear here...</p>'
  return marked(document.content)
})

// Load document data
onMounted(async () => {
  try {
    const { document: doc } = await $fetch(`/api/documents/${documentId}`)
    document.title = doc.title
    document.content = doc.content
  } catch (err) {
    if (err.statusCode === 404) {
      error.value = 'This document does not exist or you do not have permission to edit it.'
    } else if (err.statusCode === 401) {
      error.value = 'You are not authorized to edit this document.'
    } else {
      error.value = 'Failed to load document. Please try again.'
    }
  } finally {
    loading.value = false
  }
})

const saveDocument = async () => {
  if (!document.title.trim() || !document.content.trim()) {
    alert('Please enter both title and content')
    return
  }

  saving.value = true
  saved.value = false

  try {
    const { document: updatedDoc } = await $fetch(`/api/documents/${documentId}`, {
      method: 'PUT',
      body: document
    })

    saved.value = true
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1500)
  } catch (error) {
    alert('Failed to update document')
  } finally {
    saving.value = false
  }
}
</script> 