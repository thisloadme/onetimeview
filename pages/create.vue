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
            <span class="text-gray-300">Create Document</span>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="saveDocument" :disabled="saving" class="btn-primary">
              {{ saving ? 'Saving...' : 'Save Document' }}
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div class="card overflow-hidden">
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
)

```
Code block
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
          <span class="text-green-400">Document saved successfully!</span>
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

const document = reactive({
  title: '',
  content: ''
})

const saving = ref(false)
const saved = ref(false)

const renderedMarkdown = computed(() => {
  if (!document.content) return '<p class="text-gray-500">Preview will appear here...</p>'
  return marked(document.content)
})

const saveDocument = async () => {
  if (!document.title.trim() || !document.content.trim()) {
    alert('Please enter both title and content')
    return
  }

  saving.value = true
  saved.value = false

  try {
    const { document: createdDoc } = await $fetch('/api/documents', {
      method: 'POST',
      body: document
    })

    saved.value = true
    setTimeout(() => {
      navigateTo('/dashboard')
    }, 1500)
  } catch (error) {
    alert('Failed to save document')
  } finally {
    saving.value = false
  }
}
</script>

<style>
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