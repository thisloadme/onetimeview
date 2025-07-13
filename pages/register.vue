<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-3xl font-bold text-gradient">
          OneTimeView
        </NuxtLink>
        <h2 class="mt-4 text-2xl font-semibold text-gray-100">
          Create your account
        </h2>
        <p class="mt-2 text-gray-400">
          Start sharing secure documents today
        </p>
      </div>

      <div class="card">
        <form @submit.prevent="handleRegister" class="space-y-6">
          <div>
            <label for="name" class="block text-sm font-medium text-gray-300 mb-2">
              Full name
            </label>
            <input
              id="name"
              v-model="form.name"
              type="text"
              required
              class="input-field"
              placeholder="Enter your full name"
            />
          </div>

          <div>
            <label for="email" class="block text-sm font-medium text-gray-300 mb-2">
              Email address
            </label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              required
              class="input-field"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label for="password" class="block text-sm font-medium text-gray-300 mb-2">
              Password
            </label>
            <input
              id="password"
              v-model="form.password"
              type="password"
              required
              minlength="6"
              class="input-field"
              placeholder="Create a password (min. 6 characters)"
            />
          </div>

          <div v-if="error" class="text-red-400 text-sm bg-red-900/20 p-3 rounded-lg border border-red-800">
            {{ error }}
          </div>

          <button
            type="submit"
            :disabled="loading"
            class="w-full btn-primary"
          >
            <span v-if="loading">Creating account...</span>
            <span v-else>Create account</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Already have an account?
            <NuxtLink to="/login" class="text-blue-400 font-medium hover:text-blue-300">
              Sign in
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false
})

const form = reactive({
  name: '',
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const handleRegister = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await $fetch('/api/auth/register', {
      method: 'POST',
      body: form
    })

    await navigateTo('/dashboard')
  } catch (err) {
    error.value = err.data?.message || 'Registration failed'
  } finally {
    loading.value = false
  }
}
</script>