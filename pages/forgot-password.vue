<template>
  <div class="auth-page min-h-[100dvh] bg-gray-900 flex items-center justify-center px-4 sm:px-6 lg:px-8">
    <div class="max-w-lg w-full">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="flex items-center justify-center gap-3">
          <img src="~/assets/images/logo.png" alt="OneTimeView" class="h-10 w-auto" />
          <span class="text-3xl font-bold text-gradient">OneTimeView</span>
        </NuxtLink>
        <h2 class="mt-4 text-2xl font-semibold text-gray-100">Reset your password</h2>
        <p class="mt-2 text-gray-400">Enter your email and we'll send you a reset link</p>
      </div>

      <div class="card">
        <form @submit.prevent="handleForgotPassword" class="space-y-6">
          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">Email address</label>
            <input id="email" v-model="form.email" type="email" required class="input-field" placeholder="Enter your email" />
          </div>

          <div v-if="successMessage" class="text-green-400 text-sm bg-green-900/20 p-3 rounded-lg border border-green-800">
            {{ successMessage }}
          </div>
          <div v-else-if="error" class="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800">
            {{ error }}
          </div>

          <button type="submit" :disabled="loading || sent" class="w-full btn-primary">
            <span v-if="loading">Sending...</span>
            <span v-else-if="sent">Reset Link Sent</span>
            <span v-else>Send Reset Link</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Remember your password?
            <NuxtLink to="/login" class="text-[#0e2e4f] font-medium hover:text-[#1d6477]">Sign in</NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false, middleware: 'guest' })

const form = reactive({ email: '' })
const loading = ref(false)
const error = ref('')
const sent = ref(false)
const successMessage = ref('')

const handleForgotPassword = async () => {
  loading.value = true
  error.value = ''
  successMessage.value = ''

  try {
    const data = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: form
    })
    successMessage.value = data.message || 'If the email exists, a reset link has been sent.'
    sent.value = true
  } catch (err) {
    error.value = err.data?.statusMessage || err.message || 'Failed to send reset link'
  } finally {
    loading.value = false
  }
}
</script>
