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
        <DocumentCard 
          v-for="doc in documents" 
          :key="doc._id" 
          :document="doc"
          @share="shareDocument"
          @view-history="viewAccessHistory"
          @delete="deleteDocument"
        />
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

    <!-- Modals -->
    <ShareModal 
      v-model="showShareModal" 
      :document-id="selectedDocumentId" 
    />
    
    <AccessHistoryModal 
      v-model="showAccessHistoryModal" 
      :document-id="selectedDocumentId" 
      :document-title="selectedDocumentTitle" 
    />
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const user = ref(null)
const documents = ref([])
const showShareModal = ref(false)
const selectedDocumentId = ref(null)

// Access History Modal
const showAccessHistoryModal = ref(false)
const selectedDocumentTitle = ref('')

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



const viewAccessHistory = (documentId, documentTitle) => {
  selectedDocumentId.value = documentId
  selectedDocumentTitle.value = documentTitle
  showAccessHistoryModal.value = true
}
</script>