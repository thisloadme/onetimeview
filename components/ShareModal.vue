<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
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
          <button type="button" @click="$emit('update:modelValue', false)" class="flex-1 btn-secondary">
            Close
          </button>
          <button type="submit" :disabled="loading" class="flex-1 btn-primary">
            {{ loading ? 'Creating...' : 'Create Link' }}
          </button>
        </div>
      </form>

	      <!-- Active Links -->
	      <div v-if="activeLinks.length" class="mt-6">
	        <h4 class="font-medium text-gray-100 mb-1">Active links</h4>
	        <p class="text-xs text-gray-400 mb-3">
	          These links are currently active for this document.
	        </p>
	        <div class="space-y-3 max-h-48 overflow-y-auto">
	          <div
	            v-for="link in activeLinks"
	            :key="link.token"
	            class="p-3 bg-gray-900/40 rounded-lg border border-gray-700"
	          >
	            <div class="flex items-center gap-2">
	              <input
	                :value="link.fullUrl"
	                readonly
	                class="flex-1 px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
	              />
	              <button @click="copyExistingLink(link)" class="btn-secondary text-xs">
	                Copy
	              </button>
	            </div>
	            <p class="text-[11px] text-gray-400 mt-1">
	              Views: {{ link.currentAccesses }} / {{ link.maxAccesses }}
	              · Expires at {{ new Date(link.expiresAt).toLocaleString() }}
	            </p>
	          </div>
	        </div>
	      </div>

	      <!-- Generated Link (most recent) -->
	      <div v-if="generatedLink" class="mt-6 p-4 bg-green-900/20 rounded-lg border border-green-800">
	        <h4 class="font-medium text-green-400 mb-2">Link created successfully</h4>
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
	          This new link can be accessed {{ shareForm.maxAccesses }} times and expires in {{ shareForm.expiresIn }} hours.
	        </p>
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
  }
})

const emit = defineEmits(['update:modelValue'])

const loading = ref(false)
const generatedLink = ref('')
const activeLinks = ref([])

const shareForm = reactive({
  maxAccesses: 5,
  expiresIn: 24
})

const createShareLink = async () => {
  loading.value = true
  
  try {
    const { sharedLink } = await $fetch(`/api/documents/${props.documentId}/share`, {
      method: 'POST',
      body: shareForm
    })
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    generatedLink.value = `${origin}${sharedLink.url}`

    // Refresh list of active links after creating a new one
    fetchActiveLinks()
  } catch (error) {
    alert('Failed to create share link')
  } finally {
    loading.value = false
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

const copyExistingLink = async (link) => {
  try {
    await navigator.clipboard.writeText(link.fullUrl)
    alert('Link copied to clipboard!')
  } catch (error) {
    alert('Failed to copy link')
  }
}

const fetchActiveLinks = async () => {
  try {
    const { links } = await $fetch(`/api/documents/${props.documentId}/share`)
    const origin = typeof window !== 'undefined' ? window.location.origin : ''

    activeLinks.value = (links || []).map((link) => ({
      ...link,
      fullUrl: `${origin}${link.url}`
    }))
  } catch (error) {
    // If fetching fails, just clear the list silently
    activeLinks.value = []
  }
}

// Reset form when modal opens
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    generatedLink.value = ''
    shareForm.maxAccesses = 5
    shareForm.expiresIn = 24

    fetchActiveLinks()
  } else {
    activeLinks.value = []
  }
})
</script> 