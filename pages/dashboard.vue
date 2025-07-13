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
            <button @click="viewAccessHistory(doc._id, doc.title)" class="py-2 px-3 bg-purple-900/30 hover:bg-purple-900/50 text-purple-400 border border-purple-800 rounded-lg transition duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </button>
            <button @click="deleteDocument(doc._id)" class="py-2 px-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800 rounded-lg transition duration-200">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
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

    <!-- Access History Modal -->
    <div v-if="showAccessHistoryModal" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 border border-gray-700 max-h-[80vh] overflow-hidden">
        <div class="flex justify-between items-center mb-6">
          <h3 class="text-xl font-semibold text-gray-100">Access History - {{ selectedDocumentTitle }}</h3>
          <button @click="showAccessHistoryModal = false" class="text-gray-400 hover:text-gray-200">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <!-- Loading State -->
        <div v-if="accessHistoryLoading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p class="text-gray-400 mt-2">Loading access history...</p>
        </div>

        <!-- Access History Table -->
        <div v-else class="overflow-y-auto max-h-96">
          <div v-if="accessHistory.length > 0" class="space-y-3">
            <div v-for="access in accessHistory" :key="access._id" class="flex items-center justify-between p-4 bg-gray-700/50 rounded-lg border border-gray-600">
              <div class="flex-1">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <div>
                    <p class="text-gray-200 font-medium">{{ formatAccessTime(access.accessedAt) }}</p>
                    <p class="text-gray-400 text-sm">{{ access.ipAddress }}</p>
                  </div>
                </div>
              </div>
              <div class="text-right">
                <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-900/30 text-blue-400 border border-blue-800">
                  {{ access.accessType === 'shared_link' ? 'Shared Link' : 'Direct' }}
                </span>
                <p class="text-gray-400 text-xs mt-1">{{ formatUserAgent(access.userAgent) }}</p>
              </div>
            </div>
          </div>
          
          <!-- Empty State -->
          <div v-else class="text-center py-8">
            <svg class="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
            </svg>
            <h4 class="text-lg font-medium text-gray-100 mb-2">No access history yet</h4>
            <p class="text-gray-400">This document hasn't been accessed via shared links yet.</p>
          </div>
        </div>

        <!-- Pagination -->
        <div v-if="accessHistoryPagination && accessHistoryPagination.pages > 1" class="mt-6 flex justify-center">
          <div class="flex items-center gap-2">
            <button 
              @click="loadAccessHistory(accessHistoryPagination.page - 1)" 
              :disabled="accessHistoryPagination.page <= 1"
              class="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-gray-200 rounded transition duration-200"
            >
              Previous
            </button>
            <span class="text-gray-400">
              Page {{ accessHistoryPagination.page }} of {{ accessHistoryPagination.pages }}
            </span>
            <button 
              @click="loadAccessHistory(accessHistoryPagination.page + 1)" 
              :disabled="accessHistoryPagination.page >= accessHistoryPagination.pages"
              class="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-gray-200 rounded transition duration-200"
            >
              Next
            </button>
          </div>
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

// Access History Modal
const showAccessHistoryModal = ref(false)
const accessHistoryLoading = ref(false)
const accessHistory = ref([])
const accessHistoryPagination = ref(null)
const selectedDocumentTitle = ref('')

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

const deleteDocument = async (documentId) => {
  if (!confirm('Are you sure you want to delete this document? This action cannot be undone.')) {
    return
  }
  
  try {
    await $fetch(`/api/documents/${documentId}`, {
      method: 'DELETE'
    })
    
    // Remove from local array
    documents.value = documents.value.filter(doc => doc._id !== documentId)
  } catch (error) {
    alert('Failed to delete document')
  }
}

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const viewAccessHistory = async (documentId, documentTitle) => {
  selectedDocumentId.value = documentId
  selectedDocumentTitle.value = documentTitle
  showAccessHistoryModal.value = true
  await loadAccessHistory(1)
}

const loadAccessHistory = async (page = 1) => {
  accessHistoryLoading.value = true
  
  try {
    const { accessHistory: history, pagination } = await $fetch(`/api/documents/${selectedDocumentId.value}/access-history?page=${page}`)
    accessHistory.value = history
    accessHistoryPagination.value = pagination
  } catch (error) {
    console.error('Failed to load access history:', error)
    accessHistory.value = []
    accessHistoryPagination.value = null
  } finally {
    accessHistoryLoading.value = false
  }
}

const formatAccessTime = (dateString) => {
  const date = new Date(dateString)
  const now = new Date()
  const diffInMinutes = Math.floor((now - date) / (1000 * 60))
  
  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes} minutes ago`
  if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} hours ago`
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

const formatUserAgent = (userAgent) => {
  if (!userAgent || userAgent === 'unknown') return 'Unknown browser'
  
  // Simple browser detection
  if (userAgent.includes('Chrome')) return 'Chrome'
  if (userAgent.includes('Firefox')) return 'Firefox'
  if (userAgent.includes('Safari')) return 'Safari'
  if (userAgent.includes('Edge')) return 'Edge'
  if (userAgent.includes('Opera')) return 'Opera'
  
  return 'Other browser'
}
</script>