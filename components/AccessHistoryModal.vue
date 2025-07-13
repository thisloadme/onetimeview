<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-xl p-6 max-w-4xl w-full mx-4 border border-gray-700 max-h-[80vh] overflow-hidden">
      <div class="flex justify-between items-center mb-6">
        <h3 class="text-xl font-semibold text-gray-100">Access History - {{ documentTitle }}</h3>
        <button @click="$emit('update:modelValue', false)" class="text-gray-400 hover:text-gray-200">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>
      </div>
      
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-8">
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
      <div v-if="pagination && pagination.pages > 1 && pagination.page" class="mt-6 flex justify-center">
        <div class="flex items-center gap-2">
          <button 
            @click="loadPage(pagination.page - 1)" 
            :disabled="pagination.page <= 1"
            class="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-gray-200 rounded transition duration-200"
          >
            Previous
          </button>
          <span class="text-gray-400">
            Page {{ pagination.page }} of {{ pagination.pages }}
          </span>
          <button 
            @click="loadPage(pagination.page + 1)" 
            :disabled="pagination.page >= pagination.pages"
            class="px-3 py-1 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-gray-200 rounded transition duration-200"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },
  documentId: {
    type: String,
    required: true
  },
  documentTitle: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['update:modelValue'])

const loading = ref(false)
const accessHistory = ref([])
const pagination = ref(null)

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

const loadPage = async (page = 1) => {
  loading.value = true
  
  try {
    const { accessHistory: history, pagination: paginationData } = await $fetch(`/api/documents/${props.documentId}/access-history?page=${page}`)
    accessHistory.value = history
    pagination.value = paginationData
  } catch (error) {
    console.error('Failed to load access history:', error)
    accessHistory.value = []
    pagination.value = null
  } finally {
    loading.value = false
  }
}

// Load data when modal opens
watch(() => props.modelValue, (newValue) => {
  if (newValue && props.documentId) {
    loadPage(1)
  }
})
</script> 