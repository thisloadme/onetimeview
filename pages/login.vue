<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="text-3xl font-bold text-gradient">
          OneTimeView
        </NuxtLink>
        <h2 class="mt-4 text-2xl font-semibold text-gray-100">
          Welcome back
        </h2>
        <p class="mt-2 text-gray-400">
          Sign in to your account to continue
        </p>
      </div>

      <div class="card">
        <form @submit.prevent="handleLogin" class="space-y-6">
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
              class="input-field"
              placeholder="Enter your password"
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
            <span v-if="loading">Signing in...</span>
            <span v-else>Sign in</span>
          </button>
        </form>

        <div class="mt-6 text-center">
          <p class="text-gray-400">
            Don't have an account?
            <NuxtLink to="/register" class="text-blue-400 font-medium hover:text-blue-300">
              Sign up
            </NuxtLink>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  layout: false,
  middleware: 'guest'
})

const form = reactive({
  email: '',
  password: ''
})

const loading = ref(false)
const error = ref('')

const route = useRoute()

const handleLogin = async () => {
  loading.value = true
  error.value = ''

  try {
    const { data } = await $fetch('/api/auth/login', {
      method: 'POST',
      body: form
    })

    // Redirect to original URL or dashboard
    const redirectUrl = route.query.redirect || '/dashboard'
    await navigateTo(redirectUrl)
  } catch (err) {
    error.value = err.data?.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>