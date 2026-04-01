<template>
  <div class="min-h-screen bg-gray-900 flex">
    <!-- Sidebar -->
    <aside :class="['fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-72 bg-gray-950 border-r border-gray-800 transition-transform duration-300 lg:transform-none flex flex-col h-screen', sidebarOpen ? 'translate-x-0' : '-translate-x-full']">
      <!-- Logo -->
      <div class="p-6 border-b border-gray-800 flex-shrink-0">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="~/assets/images/logo.png" alt="OneTimeView" class="h-10 w-auto" />
          <span class="text-2xl font-bold text-[#0e2e4f]">OneTimeView</span>
        </NuxtLink>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2 flex-1 overflow-y-auto">
        <NuxtLink 
          to="/dashboard" 
          class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
          active-class="bg-[#0e2e4f]/20 text-[#0e2e4f] border border-[#0e2e4f]/30"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
          </svg>
          Dashboard
        </NuxtLink>
        
        <NuxtLink 
          to="/create" 
          class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
          </svg>
          New Document
        </NuxtLink>

        <NuxtLink 
          to="/create-anonymous" 
          class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
          </svg>
          Quick Create
        </NuxtLink>
      </nav>

      <!-- User Section -->
      <div class="p-4 border-t border-gray-800 flex-shrink-0">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-[#0e2e4f] rounded-full flex items-center justify-center">
            <span class="text-white font-bold">{{ user?.name?.charAt(0) || 'U' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-medium truncate">{{ user?.name }}</p>
            <p class="text-gray-500 text-xs truncate">{{ user?.email }}</p>
          </div>
        </div>
        <button 
          @click="handleLogout" 
          class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 text-red-400 border border-red-800 rounded-xl hover:bg-red-600/30 transition-all"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
          </svg>
          Logout
        </button>
      </div>
    </aside>

    <!-- Mobile Overlay -->
    <div 
      v-if="sidebarOpen" 
      @click="closeSidebar"
      class="fixed inset-0 bg-black/50 z-30 lg:hidden"
    ></div>

    <!-- Main Content -->
    <main class="flex-1 flex flex-col min-h-screen lg:ml-0">
      <!-- Top Bar (Mobile) -->
      <header class="lg:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <button @click="toggleSidebar" class="p-2 text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>
        <span class="text-xl font-bold text-[#0e2e4f]">OneTimeView</span>
        <NuxtLink to="/create" class="p-2 bg-[#0e2e4f] rounded-lg text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
          </svg>
        </NuxtLink>
      </header>

      <div class="flex-1 p-4 lg:p-8">
        <!-- Stats Overview -->
        <div class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div class="stat-card bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-400 text-sm">Total Documents</span>
              <div class="w-10 h-10 bg-[#0e2e4f]/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-[#0e2e4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.totalDocuments }}</p>
          </div>

          <div class="stat-card bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-400 text-sm">Published</span>
              <div class="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.publishedDocuments }}</p>
          </div>

          <div class="stat-card bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-400 text-sm">Total Views</span>
              <div class="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.totalViews }}</p>
          </div>

          <div class="stat-card bg-gray-800 border border-gray-700 rounded-2xl p-6">
            <div class="flex items-center justify-between mb-2">
              <span class="text-gray-400 text-sm">Active Links</span>
              <div class="w-10 h-10 bg-orange-600/20 rounded-lg flex items-center justify-center">
                <svg class="w-5 h-5 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
                </svg>
              </div>
            </div>
            <p class="text-3xl font-bold text-white">{{ stats.activeLinks }}</p>
          </div>
        </div>

        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-3xl font-bold text-gray-100">My Documents</h1>
            <p class="text-gray-400 mt-1">Create and manage your shared documents</p>
          </div>
          <NuxtLink to="/create" class="px-6 py-3 bg-[#0e2e4f] text-white font-semibold rounded-xl hover:bg-[#1d6477] transition-all flex items-center gap-2 justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            New Document
          </NuxtLink>
        </div>

        <!-- Filters & Search -->
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <!-- Search -->
          <div class="flex-1 relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
            </svg>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search documents..."
              class="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0e2e4f] focus:border-transparent"
            />
          </div>

          <!-- Filter -->
          <select
            v-model="filterStatus"
            class="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0e2e4f]"
          >
            <option value="all">All Documents</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>

          <!-- Sort -->
          <select
            v-model="sortBy"
            class="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0e2e4f]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>

        <!-- Documents Grid -->
        <div v-if="filteredDocuments.length > 0" class="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          <EnhancedDocumentCard 
            v-for="doc in filteredDocuments" 
            :key="doc.id" 
            :document="doc"
            @share="shareDocument"
            @view-history="viewAccessHistory"
            @delete="deleteDocument"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-16">
          <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
            </svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-100 mb-2">No documents found</h3>
          <p class="text-gray-400 mb-6 max-w-md mx-auto">
            {{ searchQuery ? 'Try adjusting your search or filters.' : 'Create your first document to get started.' }}
          </p>
          <NuxtLink to="/create" class="inline-flex items-center gap-2 px-6 py-3 bg-[#0e2e4f] text-white font-semibold rounded-xl hover:bg-[#1d6477] transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Create Your First Document
          </NuxtLink>
        </div>
      </div>
    </main>

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
const showAccessHistoryModal = ref(false)
const selectedDocumentId = ref(null)
const selectedDocumentTitle = ref('')
const sidebarOpen = ref(false)
const searchQuery = ref('')
const filterStatus = ref('all')
const sortBy = ref('newest')

const stats = computed(() => {
  return {
    totalDocuments: documents.value.length,
    publishedDocuments: documents.value.filter(d => d.is_published).length,
    totalViews: documents.value.reduce((sum, d) => sum + (d.total_views || 0), 0),
    activeLinks: documents.value.filter(d => d.is_published).length
  }
})

const filteredDocuments = computed(() => {
  let filtered = [...documents.value]
  
  // Search filter
  if (searchQuery.value) {
    const query = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc => 
      doc.title.toLowerCase().includes(query) ||
      doc.content.toLowerCase().includes(query)
    )
  }
  
  // Status filter
  if (filterStatus.value === 'published') {
    filtered = filtered.filter(doc => doc.is_published)
  } else if (filterStatus.value === 'draft') {
    filtered = filtered.filter(doc => !doc.is_published)
  }
  
  // Sort
  if (sortBy.value === 'newest') {
    filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  } else if (sortBy.value === 'oldest') {
    filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  } else if (sortBy.value === 'title') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  }
  
  return filtered
})

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

const toggleSidebar = () => {
  sidebarOpen.value = !sidebarOpen.value
}

const closeSidebar = () => {
  sidebarOpen.value = false
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
    
    documents.value = documents.value.filter(doc => doc.id !== documentId)
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

<style>
.stat-card {
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-4px);
  border-color: #1d6477;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
}

.nav-link {
  transition: all 0.2s ease;
}

.nav-link:hover {
  transform: translateX(4px);
}
</style>