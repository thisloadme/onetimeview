<template>
  <div class="workspace-shell min-h-[100dvh] flex" @keydown.esc="closeSidebar">
    <!-- Sidebar -->
    <aside id="app-sidebar" :class="['workspace-sidebar fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-72 border-r transition-transform duration-300 lg:transform-none flex flex-col min-h-[100dvh]', sidebarOpen ? 'translate-x-0' : '-translate-x-full']">
      <div class="p-6 border-b border-gray-800 flex-shrink-0">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="~/assets/images/logo.png" alt="OneTimeView" class="h-10 w-auto" />
          <span class="text-2xl font-bold text-[#0e2e4f]">OneTimeView</span>
        </NuxtLink>
      </div>
      <nav class="p-4 space-y-2 flex-1 overflow-y-auto">
        <NuxtLink to="/dashboard" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all bg-[#0e2e4f] text-white border border-[#1d6477]/50 shadow-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/create" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          New Document
        </NuxtLink>
        <NuxtLink to="/create-anonymous" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          Quick Create
        </NuxtLink>
        <NuxtLink to="/settings" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
          Settings
        </NuxtLink>
      </nav>
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
        <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 text-red-400 border border-red-800 rounded-xl hover:bg-red-600/30 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </div>
    </aside>

    <div v-if="sidebarOpen" @click="closeSidebar" class="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>

    <main class="workspace-main flex-1 flex flex-col min-h-[100dvh] lg:ml-0">
      <header class="lg:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <button type="button" @click="toggleSidebar" :aria-expanded="sidebarOpen" aria-controls="app-sidebar" :aria-label="sidebarOpen ? 'Close navigation' : 'Open navigation'" class="p-2 text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <span class="text-xl font-bold text-[#0e2e4f]">OneTimeView</span>
        <NuxtLink to="/create" aria-label="Create document" class="p-2 bg-[#0e2e4f] rounded-lg text-white">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
        </NuxtLink>
      </header>

      <div class="flex-1 p-4 lg:p-8">
        <!-- Header -->
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
          <div>
            <h1 class="text-4xl font-bold text-gray-100">Your documents</h1>
            <p class="text-gray-400 mt-1">Write, share, and keep track of each note.</p>
          </div>
          <NuxtLink to="/create" class="px-6 py-3 bg-[#0e2e4f] text-white font-semibold rounded-xl hover:bg-[#1d6477] transition-all flex items-center gap-2 justify-center">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            New Document
          </NuxtLink>
        </div>

        <!-- Filters -->
        <div class="flex flex-col md:flex-row gap-4 mb-6">
          <div class="flex-1 relative">
            <svg class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
            <input v-model="searchQuery" type="text" placeholder="Search documents..." class="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#0e2e4f] focus:border-transparent" />
          </div>
          <select v-model="filterStatus" class="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0e2e4f]">
            <option value="all">All Documents</option>
            <option value="published">Published Only</option>
            <option value="draft">Drafts Only</option>
          </select>
          <select v-model="sortBy" class="px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-200 focus:outline-none focus:ring-2 focus:ring-[#0e2e4f]">
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="title">Alphabetical</option>
          </select>
        </div>

        <!-- Loading Skeleton Grid -->
        <div v-if="loading" class="document-stack" aria-label="Loading documents" aria-busy="true">
          <div v-for="i in 4" :key="'skel-'+i" class="document-skeleton">
            <div class="flex justify-between mb-4">
              <div class="flex-1">
                <div class="h-5 bg-gray-700 rounded w-3/4 mb-3"></div>
                <div class="h-3 bg-gray-700 rounded w-1/3"></div>
              </div>
              <div class="w-8 h-8 bg-gray-700 rounded-lg"></div>
            </div>
            <div class="h-16 bg-gray-700 rounded-xl mb-4"></div>
            <div class="flex gap-4 mb-4">
              <div class="h-4 bg-gray-700 rounded w-16"></div>
              <div class="h-4 bg-gray-700 rounded w-16"></div>
            </div>
            <div class="flex gap-2">
              <div class="h-10 bg-gray-700 rounded-xl flex-1"></div>
              <div class="h-10 bg-gray-700 rounded-xl flex-1"></div>
              <div class="h-10 w-10 bg-gray-700 rounded-xl"></div>
              <div class="h-10 w-10 bg-gray-700 rounded-xl"></div>
            </div>
          </div>
        </div>

        <div v-else-if="loadError" class="empty-note" role="alert">
          <h2 class="text-2xl font-bold text-gray-100">Documents could not load</h2>
          <p class="text-gray-400">{{ loadError }}</p>
          <button type="button" class="btn-secondary mt-3" @click="loadPage(pagination?.page || 1)">Try again</button>
        </div>

        <!-- Document list -->
        <div v-else-if="filteredDocuments.length > 0" class="document-stack">
          <EnhancedDocumentCard
            v-for="doc in filteredDocuments"
            :key="doc.id"
            :document="doc"
            @share="shareDocument"
            @view-history="viewAccessHistory"
            @delete="confirmDelete"
          />
        </div>

        <!-- Empty State -->
        <div v-else class="empty-note text-center py-16">
          <div class="w-24 h-24 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg class="w-12 h-12 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          </div>
          <h3 class="text-xl font-semibold text-gray-100 mb-2">No documents found</h3>
          <p class="text-gray-400 mb-6 max-w-md mx-auto">{{ searchQuery ? 'Try adjusting your search or filters.' : 'Create your first document to get started.' }}</p>
          <NuxtLink to="/create" class="inline-flex items-center gap-2 px-6 py-3 bg-[#0e2e4f] text-white font-semibold rounded-xl hover:bg-[#1d6477] transition-all">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path></svg>
            Create Your First Document
          </NuxtLink>
        </div>

        <!-- ⚠️ P2.4: Pagination -->
        <div v-if="pagination && pagination.pages > 1" class="mt-8 flex flex-col items-center gap-4">
          <p class="text-sm text-gray-500">
            Showing page {{ pagination.page }} of {{ pagination.pages }}
            ({{ pagination.total }} document{{ pagination.total !== 1 ? 's' : '' }})
          </p>
          <div class="flex items-center gap-2">
            <button @click="loadPage(pagination.page - 1)" :disabled="pagination.page <= 1" class="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              Previous
            </button>
            <button v-for="p in visiblePages" :key="'page-'+p" @click="loadPage(p)" :class="['px-4 py-2 rounded-lg transition-all', p === pagination.page ? 'bg-[#0e2e4f] text-white' : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700']">
              {{ p }}
            </button>
            <button @click="loadPage(pagination.page + 1)" :disabled="pagination.page >= pagination.pages" class="px-4 py-2 bg-gray-800 border border-gray-700 text-gray-300 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all">
              Next
            </button>
          </div>
        </div>
      </div>
    </main>

    <!-- ⚠️ P2.8: Custom Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div class="absolute inset-0 bg-black/70 backdrop-blur-sm" @click="showDeleteModal = false"></div>
      <div class="relative bg-gray-900 rounded-2xl max-w-md w-full p-8 border border-gray-700 shadow-2xl">
        <div class="flex justify-center mb-6">
          <div class="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <svg class="w-8 h-8 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
            </svg>
          </div>
        </div>
        <h3 class="text-xl font-bold text-white text-center mb-2">Delete Document</h3>
        <p class="text-gray-400 text-center mb-6">Are you sure you want to delete this document? This action cannot be undone.</p>
        <div class="flex gap-3">
          <button @click="showDeleteModal = false" class="flex-1 px-4 py-3 bg-gray-800 text-white font-medium rounded-lg hover:bg-gray-700 transition-colors">Cancel</button>
          <button @click="executeDelete" :disabled="deleting" class="flex-1 px-4 py-3 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50">
            {{ deleting ? 'Deleting...' : 'Delete' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Modals -->
    <ShareModal v-model="showShareModal" :document-id="selectedDocumentId" />
    <AccessHistoryModal v-model="showAccessHistoryModal" :document-id="selectedDocumentId" :document-title="selectedDocumentTitle" />
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const user = ref(null)
const documents = ref([])
const pagination = ref(null)
const showShareModal = ref(false)
const showAccessHistoryModal = ref(false)
const selectedDocumentId = ref(null)
const selectedDocumentTitle = ref('')
const sidebarOpen = ref(false)
const searchQuery = ref('')
const filterStatus = ref('all')
const sortBy = ref('newest')
const loading = ref(true)
const loadError = ref('')

// Delete modal
const showDeleteModal = ref(false)
const deleteTargetId = ref(null)
const deleting = ref(false)

const filteredDocuments = computed(() => {
  let filtered = [...documents.value]

  if (searchQuery.value) {
    const q = searchQuery.value.toLowerCase()
    filtered = filtered.filter(doc => doc.title.toLowerCase().includes(q) || doc.content.toLowerCase().includes(q))
  }
  if (filterStatus.value === 'published') filtered = filtered.filter(doc => doc.is_published)
  else if (filterStatus.value === 'draft') filtered = filtered.filter(doc => !doc.is_published)

  if (sortBy.value === 'newest') filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
  else if (sortBy.value === 'oldest') filtered.sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
  else if (sortBy.value === 'title') filtered.sort((a, b) => a.title.localeCompare(b.title))

  return filtered
})

const visiblePages = computed(() => {
  if (!pagination.value) return []
  const current = pagination.value.page
  const total = pagination.value.pages
  const pages = []
  const start = Math.max(1, current - 2)
  const end = Math.min(total, current + 2)
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

const loadPage = async (page = 1) => {
  loading.value = true
  loadError.value = ''
  try {
    const { documents: docs, pagination: p } = await $fetch(`/api/documents?page=${page}&limit=12`)
    documents.value = docs
    pagination.value = p
  } catch (err) {
    documents.value = []
    pagination.value = null
    loadError.value = err.data?.statusMessage || 'Please check your connection and try again.'
  } finally {
    loading.value = false
  }
}

onMounted(async () => {
  try {
    const { user: userData } = await $fetch('/api/auth/me')
    user.value = userData
  } catch (err) {
    await navigateTo('/login')
    return
  }

  await loadPage(1)
})

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/')
}

const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value }
const closeSidebar = () => { sidebarOpen.value = false }

const shareDocument = (documentId) => {
  selectedDocumentId.value = documentId
  showShareModal.value = true
}

const confirmDelete = (documentId) => {
  deleteTargetId.value = documentId
  showDeleteModal.value = true
}

const executeDelete = async () => {
  deleting.value = true
  try {
    await $fetch(`/api/documents/${deleteTargetId.value}`, { method: 'DELETE' })
    documents.value = documents.value.filter(doc => doc.id !== deleteTargetId.value)
    if (pagination.value) pagination.value.total -= 1
    showDeleteModal.value = false
  } catch (err) {
    alert('Failed to delete document')
  } finally {
    deleting.value = false
    deleteTargetId.value = null
  }
}

const viewAccessHistory = (documentId, documentTitle) => {
  selectedDocumentId.value = documentId
  selectedDocumentTitle.value = documentTitle
  showAccessHistoryModal.value = true
}
</script>
