<template>
  <div v-if="modelValue" class="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
    <div class="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 border border-gray-700">
      <h3 class="text-xl font-semibold text-gray-100 mb-4">Share Document</h3>
      
      <form @submit.prevent="createShareLink" class="space-y-4">
        <fieldset>
          <legend class="block text-sm font-medium text-gray-300 mb-2">Quick presets</legend>
          <div class="space-y-2">
            <button
              v-for="preset in sharePresets"
              :key="preset.id"
              type="button"
              :aria-pressed="isPresetSelected(preset)"
              @click="applyPreset(preset)"
              :class="isPresetSelected(preset) ? 'border-[#1d6477] bg-[#0e2e4f]/30 text-white' : 'border-gray-700 bg-gray-900/40 text-gray-300 hover:border-gray-500'"
              class="w-full min-h-11 rounded-lg border px-3 py-2 text-left text-sm transition-colors"
            >
              {{ preset.label }}
            </button>
          </div>
        </fieldset>

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
            <option value="720">30 days</option>
          </select>
        </div>

        <div>
          <label for="share-passphrase" class="block text-sm font-medium text-gray-300 mb-2">
            Passphrase (optional)
          </label>
          <input
            id="share-passphrase"
            v-model.trim="shareForm.passphrase"
            type="password"
            minlength="8"
            maxlength="128"
            autocomplete="new-password"
            class="input-field min-h-11"
            placeholder="At least 8 characters"
          />
          <p class="mt-2 text-xs text-gray-400">Share the passphrase separately from the link.</p>
        </div>

        <p v-if="shareError" role="alert" class="text-sm text-red-300">{{ shareError }}</p>
        
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
        <p class="text-xs text-gray-400 mb-3">
          Passphrases cannot be recovered. Revoke the link and create a new one if you lose it.
        </p>
        <div class="space-y-3 max-h-64 overflow-y-auto">
	          <div
	            v-for="link in activeLinks"
	            :key="link.token"
	            class="p-3 bg-gray-900/40 rounded-lg border border-gray-700"
	          >
	            <div class="flex flex-col sm:flex-row gap-2">
	              <input
	                :value="link.fullUrl"
	                readonly
	                class="min-w-0 flex-1 min-h-11 px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
	              />
	              <button type="button" @click="copyExistingLink(link)" class="btn-secondary min-h-11 text-xs">
	                Copy
	              </button>
	            </div>
	            <p class="text-[11px] text-gray-400 mt-2 break-words">
	              Views: {{ link.currentAccesses }} / {{ link.maxAccesses }}
              · Expires at {{ new Date(link.expiresAt).toLocaleString() }}
              · {{ link.requiresPassphrase ? 'Passphrase protected' : 'No passphrase' }}
	            </p>
            <button
              type="button"
              :disabled="revokingLinkId === link.id"
              @click="revokeLink(link)"
              class="mt-1 min-h-11 px-2 text-xs text-red-300 hover:text-red-200 disabled:opacity-50"
            >
              {{ revokingLinkId === link.id ? 'Revoking...' : 'Revoke link' }}
            </button>
	          </div>
	        </div>
        <p v-if="revokeError" role="alert" class="mt-2 text-xs text-red-300">{{ revokeError }}</p>
	      </div>

	      <!-- Generated Link (most recent) -->
	      <div v-if="generatedLink" class="mt-6 p-4 bg-green-900/20 rounded-lg border border-green-800">
	        <h4 class="font-medium text-green-400 mb-2">Link created successfully</h4>
	        <div class="flex flex-col sm:flex-row gap-2">
	          <input
	            :value="generatedLink"
	            readonly
	            class="min-w-0 flex-1 min-h-11 px-3 py-2 text-sm bg-gray-700 border border-gray-600 rounded text-gray-200"
	          />
	          <button type="button" @click="copyLink" class="btn-secondary min-h-11 text-sm">
	            Copy
	          </button>
	        </div>
	        <p class="text-xs text-green-400 mt-2">
	          This new link can be accessed {{ generatedMaxAccesses }} times and expires in {{ generatedExpiresIn }} hours.
	        </p>
        <div v-if="generatedLinkRequiresPassphrase" class="mt-3">
          <p class="text-xs text-green-200 mb-2">Send this passphrase separately from the link.</p>
          <div class="flex flex-col sm:flex-row gap-2">
            <input
              :value="generatedPassphrase"
              type="password"
              readonly
              aria-label="Passphrase used for this link"
              class="min-w-0 flex-1 min-h-11 px-3 py-2 text-xs bg-gray-700 border border-gray-600 rounded text-gray-200"
            />
            <button type="button" @click="copyPassphrase" class="btn-secondary min-h-11 text-xs">
              {{ passphraseCopied ? 'Copied' : 'Copy passphrase' }}
            </button>
          </div>
        </div>
        <p v-if="generatedLinkRequiresPassphrase && shareForm.passphrase.trim() !== generatedPassphrase" class="text-xs text-yellow-200 mt-2">
          This link uses the passphrase shown above, even if you change the form.
        </p>
	      </div>
    </div>
  </div>
</template>

<script setup>
import { SHARE_PRESETS } from '~/utils/sharePresets'

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
const revokingLinkId = ref(null)
const shareError = ref('')
const revokeError = ref('')
const generatedLink = ref('')
const generatedLinkRequiresPassphrase = ref(false)
const generatedPassphrase = ref('')
const generatedMaxAccesses = ref(0)
const generatedExpiresIn = ref(0)
const passphraseCopied = ref(false)
const activeLinks = ref([])
const sharePresets = SHARE_PRESETS

const shareForm = reactive({
  maxAccesses: 5,
  expiresIn: 24,
  passphrase: ''
})

const isPresetSelected = (preset) =>
  shareForm.maxAccesses === preset.maxAccesses && shareForm.expiresIn === preset.expiresIn

const applyPreset = (preset) => {
  shareForm.maxAccesses = preset.maxAccesses
  shareForm.expiresIn = preset.expiresIn
}

const createShareLink = async () => {
  const passphrase = shareForm.passphrase.trim()
  if (passphrase && (passphrase.length < 8 || passphrase.length > 128)) {
    shareError.value = 'Passphrase must be between 8 and 128 characters.'
    return
  }

  loading.value = true
  shareError.value = ''
  
  try {
    const { sharedLink } = await $fetch(`/api/documents/${props.documentId}/share`, {
      method: 'POST',
      body: shareForm
    })
    const origin = typeof window !== 'undefined' ? window.location.origin : ''
    generatedLink.value = `${origin}${sharedLink.url}`
    generatedLinkRequiresPassphrase.value = sharedLink.requiresPassphrase
    generatedPassphrase.value = sharedLink.requiresPassphrase ? passphrase : ''
    generatedMaxAccesses.value = shareForm.maxAccesses
    generatedExpiresIn.value = shareForm.expiresIn
    passphraseCopied.value = false

    // Refresh list of active links after creating a new one
    fetchActiveLinks()
  } catch (error) {
    console.error('Failed to create share link:', error)
    shareError.value = error.data?.statusMessage || 'Failed to create share link. Please try again.'
  } finally {
    loading.value = false
  }
}

const revokeLink = async (link) => {
  if (!window.confirm('Revoke this link? Anyone using it will lose access.')) return

  revokingLinkId.value = link.id
  revokeError.value = ''
  try {
    await $fetch(`/api/documents/${props.documentId}/share/${link.id}`, { method: 'DELETE' })
    if (generatedLink.value.endsWith(link.url)) {
      generatedLink.value = ''
      generatedLinkRequiresPassphrase.value = false
      generatedPassphrase.value = ''
      generatedMaxAccesses.value = 0
      generatedExpiresIn.value = 0
    }
    await fetchActiveLinks()
  } catch (error) {
    revokeError.value = error.data?.statusMessage || 'Failed to revoke link. Please try again.'
  } finally {
    revokingLinkId.value = null
  }
}

const copyPassphrase = async () => {
  try {
    await navigator.clipboard.writeText(generatedPassphrase.value)
    passphraseCopied.value = true
    setTimeout(() => {
      passphraseCopied.value = false
    }, 2000)
  } catch (error) {
    shareError.value = 'Failed to copy passphrase.'
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
    generatedLinkRequiresPassphrase.value = false
    generatedPassphrase.value = ''
    generatedMaxAccesses.value = 0
    generatedExpiresIn.value = 0
    passphraseCopied.value = false
    shareForm.maxAccesses = 5
    shareForm.expiresIn = 24
    shareForm.passphrase = ''
    shareError.value = ''
    revokeError.value = ''

    fetchActiveLinks()
  } else {
    activeLinks.value = []
    generatedLink.value = ''
    generatedLinkRequiresPassphrase.value = false
    generatedPassphrase.value = ''
    generatedMaxAccesses.value = 0
    generatedExpiresIn.value = 0
    passphraseCopied.value = false
    shareForm.passphrase = ''
  }
})
</script>
