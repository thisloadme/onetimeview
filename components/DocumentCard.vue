<template>
  <div class="card hover:shadow-xl transition-all duration-200">
    <div class="flex justify-between items-start mb-4">
      <h3 class="text-xl font-semibold text-gray-100 truncate">{{ document.title }}</h3>
      <span v-if="document.isPublished" class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-900/30 text-green-400 border border-green-800">
        Published
      </span>
    </div>
    
    <div class="text-gray-400 text-sm mb-4 line-clamp-3">
      {{ document.content.substring(0, 150) }}{{ document.content.length > 150 ? '...' : '' }}
    </div>
    
    <div class="flex justify-between items-center text-sm text-gray-500 mb-4">
      <span>{{ formatDate(document.updatedAt) }}</span>
    </div>
    
    <div class="flex gap-2">
      <NuxtLink :to="`/edit/${document._id}`" class="flex-1 text-center py-2 px-4 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition duration-200">
        Edit
      </NuxtLink>
      <button @click="$emit('share', document._id)" class="flex-1 py-2 px-4 bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border border-blue-800 rounded-lg transition duration-200">
        Share
      </button>
      <button @click="$emit('viewHistory', document._id, document.title)" class="py-2 px-3 bg-purple-900/30 hover:bg-purple-900/50 text-purple-400 border border-purple-800 rounded-lg transition duration-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
        </svg>
      </button>
      <button @click="$emit('delete', document._id)" class="py-2 px-3 bg-red-900/30 hover:bg-red-900/50 text-red-400 border border-red-800 rounded-lg transition duration-200">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path>
        </svg>
      </button>
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

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}
</script> 