<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="flex items-center justify-center gap-3">
          <img src="~/assets/images/logo.png" alt="OneTimeView" class="h-10 w-auto" />
          <span class="text-3xl font-bold text-gradient">OneTimeView</span>
        </NuxtLink>
        <h2 class="mt-4 text-2xl font-semibold text-gray-100">Set new password</h2>
        <p class="mt-2 text-gray-400">Enter your new password below</p>
      </div>

      <div class="card">
        <div v-if="!hasToken" class="text-center py-8">
          <svg class="w-16 h-16 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
          </svg>
          <h3 class="text-xl font-semibold text-gray-100 mb-2">Invalid Reset Link</h3>
          <p class="text-gray-400 mb-6">This reset link is missing or invalid.</p>
          <NuxtLink to="/forgot-password" class="btn-primary inline-block">Request New Link</NuxtLink>
        </div>

        <form v-else @submit.prevent="handleResetPassword" class="space-y-6">
          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
            <input id="password" v-model="form.password" type="password" required minlength="6" class="input-field" placeholder="Min. 6 characters" />
          </div>
          <div>
            <label for="confirmPassword" class="block text-sm font-medium text-gray-300 mb-2">Confirm Password</label>
            <input id="confirmPassword" v-model="form.confirmPassword" type="password" required class="input-field" placeholder="Repeat your password" />
          </div>

          <div v-if="successMessage" class="text-green-400 text-sm bg-green-900/20 p-3 rounded-lg border border-green-800">
            {{ successMessage }}
          </div>
          <div v-else-if="error" class="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800">
            {{ error }}
          </div>

          <button type="submit" :disabled="loading || done" class="w-full btn-primary">
            <span v-if="loading">Resetting...</span>
            <span v-else-if="done">Password Reset</span>
            <span v-else>Reset Password</span>
          </button>

          <div v-if="done" class="text-center">
            <NuxtLink to="/login" class="text-[#0e2e4f] font-medium hover:text-[#1d6477]">Sign in with new password</NuxtLink>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: false })

const route = useRoute()
const hasToken = computed(() => !!route.query.token)

const form = reactive({ password: '', confirmPassword: '' })
const loading = ref(false)
const error = ref('')
const successMessage = ref('')
const done = ref(false)

const handleResetPassword = async () => {
  error.value = ''

  if (form.password !== form.confirmPassword) {
    error.value = 'Passwords do not match'
    return
  }
  if (form.password.length < 6) {
    error.value = 'Password must be at least 6 characters'
    return
  }

  loading.value = true

  try {
    const data = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: { token: route.query.token, password: form.password }
    })
    successMessage.value = data.message
    done.value = true
  } catch (err) {
    error.value = err.data?.statusMessage || err.message || 'Failed to reset password'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.card {
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  padding: 2rem;
}
.input-field {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(31, 41, 55, 0.8);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 0.5rem;
  color: white;
  font-size: 1rem;
  transition: all 0.3s ease;
}
.input-field:focus { outline: none; border-color: #0e2e4f; box-shadow: 0 0 0 3px rgba(14, 46, 79, 0.1); }
.input-field::placeholder { color: rgba(255, 255, 255, 0.4); }
.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background: #0e2e4f; border: none; border-radius: 0.5rem; color: white; font-weight: 600; font-size: 1rem; cursor: pointer; transition: all 0.3s ease;
}
.btn-primary:hover:not(:disabled) { background: #1d6477; transform: translateY(-2px); box-shadow: 0 10px 20px rgba(14, 46, 79, 0.3); }
.btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
</style>
