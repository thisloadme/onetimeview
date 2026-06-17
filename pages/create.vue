<template>
  <div class="min-h-screen bg-gray-900">
    <nav class="nav-bg border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center space-x-4">
            <NuxtLink to="/dashboard" class="text-2xl font-bold text-gradient">OneTimeView</NuxtLink>
            <span class="text-gray-600">/</span>
            <span class="text-gray-300">Create Document</span>
          </div>
          <div class="flex items-center space-x-4">
            <button @click="saveDocument" :disabled="saving" class="btn-primary">{{ saving ? 'Saving...' : 'Save Document' }}</button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <MarkdownEditor v-model="markdownDocument" />

      <!-- ⚠️ P2.6: Success with manual button instead of auto-redirect -->
      <div v-if="saved" class="mt-6 p-6 bg-green-900/20 border border-green-800 rounded-xl">
        <div class="flex items-center gap-3 mb-4">
          <svg class="w-6 h-6 text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd"></path>
          </svg>
          <span class="text-green-400 font-semibold text-lg">Document saved successfully!</span>
        </div>
        <p class="text-green-100/80 text-sm mb-4">
          Your document has been created. You can now share it or continue editing.
        </p>
        <div class="flex gap-3">
          <NuxtLink to="/dashboard" class="px-6 py-2.5 bg-[#0e2e4f] text-white font-medium rounded-lg hover:bg-[#1d6477] transition-all">
            Back to Dashboard
          </NuxtLink>
          <NuxtLink :to="`/edit/${createdDocId}`" class="px-6 py-2.5 bg-gray-700 text-white font-medium rounded-lg hover:bg-gray-600 transition-all">
            Continue Editing
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const markdownDocument = reactive({ title: '', content: '' })
const saving = ref(false)
const saved = ref(false)
const createdDocId = ref(null)

const saveDocument = async () => {
  if (!markdownDocument.title.trim() || !markdownDocument.content.trim()) {
    alert('Please enter both title and content')
    return
  }
  saving.value = true
  saved.value = false
  try {
    const { document: createdDoc } = await $fetch('/api/documents', {
      method: 'POST',
      body: markdownDocument
    })
    createdDocId.value = createdDoc.id
    saved.value = true
  } catch (error) {
    alert('Failed to save document')
  } finally {
    saving.value = false
  }
}
</script>
