<template>
  <div class="min-h-screen bg-gray-900">
    <!-- Navigation -->
    <nav class="nav-bg border-b">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-2xl font-bold text-gradient">
              OneTimeView
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <span class="text-gray-300">{{ user?.name }}</span>
            <button @click="handleLogout" class="btn-secondary">
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>

    <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <!-- Header -->
      <div class="flex justify-between items-center mb-8">
        <div>
          <h1 class="text-3xl font-bold text-gray-100">My Documents</h1>
          <p class="text-gray-400 mt-1">Create and manage your shared markdown documents</p>
        </div>
        <NuxtLink to="/create" class="btn-primary">
          <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
          New Document
        </NuxtLink>
      </div>

      <!-- Documents Grid -->
      <div v-if="documents.length > 0" class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div v-for="doc in documents" :key="doc._id" class="card hover:shadow-xl transition-all duration-200">
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-semibold text-gray-100 truncate">{{ doc.title }}</h3>
            <span v-if="doc.isPublished" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
              Published
            </span>
          </div>
          
          <div class="text-gray-400 text-sm mb-4 line-clamp-3">
            {{ doc.content.substring(0, 150) }}{{ doc.content.length > 150 ? '...' : '' }}
          </div>
          
          <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
            <span>{{ formatDate(doc.updatedAt) }}</span>
          </div>
          
          <div class="flex gap-2">
            <NuxtLink :to="`/edit/${doc._id}`" class="flex-1 text-center py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition duration-200">
              Edit
            </NuxtLink>
            <button @click="shareDocument(doc._id)" class="flex-1 py-2 px-4 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-800 rounded-lg transition duration-200">
              Share
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="text-center py-16">
        <svg class="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
        </svg>
        <h3 class="text-xl font-semibold text-gray-100 mb-2">No documents yet</h3>
        <p class="text-gray-400 mb-6">Create your first markdown document to get started.</p>
        <NuxtLink to="/create" class="btn-primary">
          Create Your First Document
        </NuxtLink>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
        <h3 class="text-xl font-semibold text-gray-100 mb-4">Share Document</h3>
        
        <form @submit.prevent="createShareLink" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Maximum number of views
            </label>
            <input
              v-model.number="shareForm.maxAccesses"
              type="number"
              min="1"
              max="1000"
              required
              class="input-field"
              placeholder="e.g., 5"
            />
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-300 mb-2">
              Expires in (hours)
            </label>
            <select v-model.number="shareForm.expiresIn" class="input-field">
              <option value="1">1 hour</option>
              <option value="6">6 hours</option>
              <option value="24">24 hours</option>
              <option value="72">3 days</option>
              <option value="168">1 week</option>
            </select>
          </div>
          
          <div class="flex gap-3 mt-6">
            <button type="button" @click="showShareModal = false" class="flex-1 btn-secondary">
              Cancel
            </button>
            <button type="submit" :disabled="shareLoading" class="flex-1 btn-primary">
              {{ shareLoading ? 'Creating...' : 'Create Link' }}
            </button>
          </div>
        </form>

        <!-- Generated Link -->
        <div v-if="generatedLink" class="mt-6 p-4 bg-green-900/20 rounded-lg border border-green-800">
          <h4 class="font-medium text-green-400 mb-2">Link Created Successfully!</h4>
          <div class="flex items-center gap-2">
            <input
              :value="generatedLink"
              readonly
              class="flex-1 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-gray-200"
            />
            <button @click="copyLink" class="btn-secondary text-sm">
              Copy
            </button>
          </div>
          <p class="text-xs text-green-400 mt-2">
            This link can be accessed {{ shareForm.maxAccesses }} times and expires in {{ shareForm.expiresIn }} hours.
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const user = ref(null)
const documents = ref([])
const showShareModal = ref(false)
const shareLoading = ref(false)
const selectedDocumentId = ref(null)
const generatedLink = ref('')

const shareForm = reactive({
  maxAccesses: 5,
  expiresIn: 24
})

// Fetch user and documents
onMounted(async () => {
  try {
    const { user: userData } = await $fetch('/api/auth/me')
    user.value = userData
    
    const { documents: docs } = await $fetch('/api/documents')
    documents.value = docs
  } catch (error) {
    await navigateTo('/login')
  }
})

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/')
}

const shareDocument = (documentId) => {
  selectedDocumentId.value = documentId
  showShareModal.value = true
  generatedLink.value = ''
}

const createShareLink = async () => {
  shareLoading.value = true
  
  try {
    const { sharedLink } = await $fetch(`/api/documents/${selectedDocumentId.value}/share`, {
      method: 'POST',
      body: shareForm
    })
    
    generatedLink.value = `${window.location.origin}${sharedLink.url}`
  } catch (error) {
    alert('Failed to create share link')
  } finally {
    shareLoading.value = false
  }
}

const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(generatedLink.value)
    alert('Link copied to clipboard!')
  } catch (error) {
    alert('Failed to copy link')
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script>