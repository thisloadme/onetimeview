<template>
  <div class="min-h-screen bg-gray-900 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full">
      <div class="text-center mb-8">
        <NuxtLink to="/" class="flex items-center justify-center gap-3">
          <img src="~/assets/images/logo.png" alt="OneTimeView" class="h-10 w-auto" />
          <span class="text-3xl font-bold text-gradient">OneTimeView</span>
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
            <NuxtLink to="/register" class="text-[#0e2e4f] font-medium hover:text-[#1d6477]">
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
    // ⚠️ FIX P1.5: Nuxt error uses statusMessage, not message
    error.value = err.data?.statusMessage || err.message || 'Login failed'
  } finally {
    loading.value = false
  }
}
</script>

<style>
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

.input-field:focus {
  outline: none;
  border-color: #0e2e4f;
  box-shadow: 0 0 0 3px rgba(14, 46, 79, 0.1);
}

.input-field::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

.btn-primary {
  width: 100%;
  padding: 0.875rem;
  background: #0e2e4f;
  border: none;
  border-radius: 0.5rem;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-primary:hover:not(:disabled) {
  background: #1d6477;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(14, 46, 79, 0.3);
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
</style>