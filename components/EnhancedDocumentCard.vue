<template>
  <div class="enhanced-card group relative bg-gray-800 border border-gray-700 rounded-2xl overflow-hidden transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl hover:shadow-black/30 hover:border-[#1d6477]">
    <!-- Status Bar -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-[#0e2e4f] opacity-0 group-hover:opacity-100 transition-opacity"></div>

    <!-- Card Content -->
    <div class="p-6">
      <!-- Header -->
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1 min-w-0 pr-4">
          <h3 class="text-lg font-semibold text-gray-100 mb-2 line-clamp-2 group-hover:text-[#0e2e4f] transition-colors">
            {{ document.title }}
          </h3>
          <!-- Status Badge -->
          <div class="flex items-center gap-2">
            <span 
              :class="[
                'inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium',
                document.is_published 
                  ? 'bg-green-900/30 text-green-400 border border-green-800' 
                  : 'bg-gray-700/30 text-gray-400 border border-gray-600'
              ]"
            >
              {{ document.is_published ? 'Published' : 'Draft' }}
            </span>
            <span class="text-xs text-gray-500">{{ formatDate(document.updated_at) }}</span>
          </div>
        </div>
        
        <!-- Quick Actions -->
        <div class="relative">
          <button 
            @click="showQuickMenu = !showQuickMenu"
            class="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"></path>
            </svg>
          </button>
          
          <!-- Quick Menu Dropdown -->
          <div v-if="showQuickMenu" class="absolute right-0 top-full mt-2 w-48 bg-gray-800 border border-gray-700 rounded-xl shadow-xl z-20">
            <button 
              @click="handleEdit"
              class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
              Edit Document
            </button>
            <button 
              @click="handleShare"
              class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
              </svg>
              Share Link
            </button>
            <button 
              @click="handleViewHistory"
              class="w-full flex items-center gap-3 px-4 py-3 text-left text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
              View History
            </button>
            <div class="h-px bg-gray-700 my-1"></div>
            <button 
              @click="handleDelete"
              class="w-full flex items-center gap-3 px-4 py-3 text-left text-red-400 hover:bg-red-900/20 transition-colors"
            >
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
              </svg>
              Delete Document
            </button>
          </div>
        </div>
      </div>

      <!-- Preview -->
      <div class="mb-4 p-4 bg-gray-900/50 rounded-xl border border-gray-700/50">
        <p class="text-sm text-gray-400 line-clamp-3 leading-relaxed">
          {{ previewText }}
        </p>
      </div>

      <!-- Stats Row -->
      <div class="flex items-center justify-between text-sm mb-4">
        <div class="flex items-center gap-4">
          <!-- Views Count -->
          <div class="flex items-center gap-1.5 text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
            </svg>
            <span>{{ document.total_views || 0 }} views</span>
          </div>
          
          <!-- Links Count -->
          <div class="flex items-center gap-1.5 text-gray-400">
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path>
            </svg>
            <span>{{ document.shared_links_count || 0 }} links</span>
          </div>
        </div>

        <!-- Last Updated -->
        <div class="flex items-center gap-1.5 text-gray-500">
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <span>{{ timeAgo }}</span>
        </div>
      </div>

      <!-- Action Buttons -->
      <div class="flex gap-2">
        <button 
          @click="handleEdit"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-xl transition-all hover:transform hover:scale-105"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
          </svg>
          Edit
        </button>
        <button 
          @click="handleShare"
          class="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#0e2e4f]/20 hover:bg-[#0e2e4f]/30 text-[#0e2e4f] border border-[#0e2e4f] rounded-xl transition-all hover:transform hover:scale-105"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"></path>
          </svg>
          Share
        </button>
        <button 
          @click="handleViewHistory"
          class="px-3 py-2.5 bg-[#1d6477]/20 hover:bg-[#1d6477]/30 text-[#1d6477] border border-[#1d6477] rounded-xl transition-all hover:transform hover:scale-105"
          title="View Access History"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
          </svg>
        </button>
        <button 
          @click="handleDelete"
          class="px-3 py-2.5 bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-800 rounded-xl transition-all hover:transform hover:scale-105"
          title="Delete Document"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  document: {
    type: Object,
    required: true
  }
})

const emit = defineEmits(['share', 'viewHistory', 'delete'])

const showQuickMenu = ref(false)

const previewText = computed(() => {
  const content = props.document.content || ''
  const plainText = content
    .replace(/#{1,6}\s/g, '')
    .replace(/\*\*/g, '')
    .replace(/`/g, '')
    .replace(/\[.*?\]\(.*?\)/g, '')
    .replace(/\n/g, ' ')
    .trim()
  
  return plainText.length > 150 ? plainText.substring(0, 150) + '...' : plainText
})

const timeAgo = computed(() => {
  const date = new Date(props.document.updated_at)
  const now = new Date()
  const seconds = Math.floor((now - date) / 1000)
  
  const intervals = {
    year: 31536000,
    month: 2592000,
    week: 604800,
    day: 86400,
    hour: 3600,
    minute: 60
  }
  
  for (const [unit, secondsInUnit] of Object.entries(intervals)) {
    const interval = Math.floor(seconds / secondsInUnit)
    if (interval >= 1) {
      return `${interval} ${unit}${interval > 1 ? 's' : ''} ago`
    }
  }
  
  return 'Just now'
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const handleEdit = () => {
  navigateTo(`/edit/${props.document.id}`)
}

const handleShare = () => {
  emit('share', props.document.id)
}

const handleViewHistory = () => {
  emit('viewHistory', props.document.id, props.document.title)
}

const handleDelete = () => {
  emit('delete', props.document.id)
}

// Close menu when clicking outside
onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})

const handleClickOutside = (event) => {
  const menu = event.target.closest('.relative')
  if (!menu) {
    showQuickMenu.value = false
  }
}
</script>

<style>
.enhanced-card {
  transition: all 0.3s ease;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>