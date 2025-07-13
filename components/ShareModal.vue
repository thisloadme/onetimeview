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
    
    generatedLink.value = `${window.location.origin}${sharedLink.url}`
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

// Reset form when modal opens
watch(() => props.modelValue, (newValue) => {
  if (newValue) {
    generatedLink.value = ''
    shareForm.maxAccesses = 5
    shareForm.expiresIn = 24
  }
})
</script> 