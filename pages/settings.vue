<template>
  <div class="min-h-screen bg-gray-900 flex">
    <!-- Sidebar (same as dashboard) -->
    <aside :class="['fixed lg:sticky lg:top-0 inset-y-0 left-0 z-40 w-72 bg-gray-950 border-r border-gray-800 transition-transform duration-300 lg:transform-none flex flex-col h-screen', sidebarOpen ? 'translate-x-0' : '-translate-x-full']">
      <div class="p-6 border-b border-gray-800 flex-shrink-0">
        <NuxtLink to="/" class="flex items-center gap-3">
          <img src="~/assets/images/logo.png" alt="OneTimeView" class="h-10 w-auto" />
          <span class="text-2xl font-bold text-[#0e2e4f]">OneTimeView</span>
        </NuxtLink>
      </div>
      <nav class="p-4 space-y-2 flex-1 overflow-y-auto">
        <NuxtLink to="/dashboard" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all" active-class="bg-[#0e2e4f] text-white border border-[#1d6477]/50 shadow-md">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
          Dashboard
        </NuxtLink>
        <NuxtLink to="/create" class="nav-link flex items-center gap-3 px-4 py-3 rounded-xl text-gray-300 hover:bg-gray-800 hover:text-white transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
          New Document
        </NuxtLink>
      </nav>
      <div class="p-4 border-t border-gray-800 flex-shrink-0">
        <div class="flex items-center gap-3 mb-4">
          <div class="w-10 h-10 bg-[#0e2e4f] rounded-full flex items-center justify-center">
            <span class="text-white font-bold">{{ user?.name?.charAt(0) || 'U' }}</span>
          </div>
          <div class="flex-1 min-w-0">
            <p class="text-white font-medium truncate">{{ user?.name }}</p>
            <p class="text-gray-500 text-xs truncate">{{ user?.email }}</p>
          </div>
        </div>
        <button @click="handleLogout" class="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-600/20 text-red-400 border border-red-800 rounded-xl hover:bg-red-600/30 transition-all">
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
          Logout
        </button>
      </div>
    </aside>

    <div v-if="sidebarOpen" @click="closeSidebar" class="fixed inset-0 bg-black/50 z-30 lg:hidden"></div>

    <main class="flex-1 flex flex-col min-h-screen lg:ml-0">
      <header class="lg:hidden flex items-center justify-between p-4 border-b border-gray-800 bg-gray-900">
        <button @click="toggleSidebar" class="p-2 text-gray-400 hover:text-white">
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
        </button>
        <span class="text-xl font-bold text-[#0e2e4f]">Settings</span>
        <div class="w-10"></div>
      </header>

      <div class="flex-1 p-4 lg:p-8 max-w-2xl mx-auto w-full">
        <h1 class="text-3xl font-bold text-gray-100 mb-8">Settings</h1>

        <!-- Profile Section -->
        <div class="card p-6 mb-6">
          <h2 class="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-[#0e2e4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Profile
          </h2>
          <form @submit.prevent="handleUpdateProfile" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Name</label>
              <input v-model="profileForm.name" type="text" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Email</label>
              <input :value="user?.email" type="email" disabled class="input-field opacity-60 cursor-not-allowed" />
              <p class="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            <div v-if="profileMessage" :class="['text-sm p-3 rounded-lg border', profileMessageType === 'success' ? 'text-green-400 bg-green-900/20 border-green-800' : 'text-red-400 bg-red-900/20 border-red-800']">
              {{ profileMessage }}
            </div>
            <button type="submit" :disabled="profileLoading" class="px-6 py-2.5 bg-[#0e2e4f] text-white font-semibold rounded-lg hover:bg-[#1d6477] transition-all disabled:opacity-50">
              {{ profileLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </form>
        </div>

        <!-- Password Section -->
        <div class="card p-6">
          <h2 class="text-xl font-bold text-gray-100 mb-6 flex items-center gap-2">
            <svg class="w-6 h-6 text-[#0e2e4f]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
            </svg>
            Change Password
          </h2>
          <form @submit.prevent="handleChangePassword" class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">Current Password</label>
              <input v-model="passwordForm.currentPassword" type="password" required class="input-field" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-300 mb-2">New Password</label>
              <input v-model="passwordForm.newPassword" type="password" required minlength="6" class="input-field" placeholder="Min. 6 characters" />
            </div>
            <div v-if="passwordMessage" :class="['text-sm p-3 rounded-lg border', passwordMessageType === 'success' ? 'text-green-400 bg-green-900/20 border-green-800' : 'text-red-400 bg-red-900/20 border-red-800']">
              {{ passwordMessage }}
            </div>
            <button type="submit" :disabled="passwordLoading" class="px-6 py-2.5 bg-[#0e2e4f] text-white font-semibold rounded-lg hover:bg-[#1d6477] transition-all disabled:opacity-50">
              {{ passwordLoading ? 'Updating...' : 'Update Password' }}
            </button>
          </form>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
definePageMeta({ middleware: 'auth' })

const user = ref(null)
const sidebarOpen = ref(false)

const profileForm = reactive({ name: '' })
const profileLoading = ref(false)
const profileMessage = ref('')
const profileMessageType = ref('success')

const passwordForm = reactive({ currentPassword: '', newPassword: '' })
const passwordLoading = ref(false)
const passwordMessage = ref('')
const passwordMessageType = ref('success')

onMounted(async () => {
  try {
    const { user: userData } = await $fetch('/api/auth/me')
    user.value = userData
    profileForm.name = userData.name
  } catch (err) {
    await navigateTo('/login')
  }
})

const handleUpdateProfile = async () => {
  profileLoading.value = true
  profileMessage.value = ''
  try {
    const { user: updated } = await $fetch('/api/auth/profile', {
      method: 'PUT',
      body: { name: profileForm.name }
    })
    user.value = updated
    profileMessage.value = 'Profile updated successfully'
    profileMessageType.value = 'success'
  } catch (err) {
    profileMessage.value = err.data?.statusMessage || err.message || 'Failed to update profile'
    profileMessageType.value = 'error'
  } finally {
    profileLoading.value = false
  }
}

const handleChangePassword = async () => {
  passwordLoading.value = true
  passwordMessage.value = ''
  try {
    await $fetch('/api/auth/password', {
      method: 'PUT',
      body: passwordForm
    })
    passwordMessage.value = 'Password updated successfully'
    passwordMessageType.value = 'success'
    passwordForm.currentPassword = ''
    passwordForm.newPassword = ''
  } catch (err) {
    passwordMessage.value = err.data?.statusMessage || err.message || 'Failed to update password'
    passwordMessageType.value = 'error'
  } finally {
    passwordLoading.value = false
  }
}

const handleLogout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  await navigateTo('/')
}
const toggleSidebar = () => { sidebarOpen.value = !sidebarOpen.value }
const closeSidebar = () => { sidebarOpen.value = false }
</script>

<style scoped>
.card {
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
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
.nav-link { transition: all 0.2s ease; }
.nav-link:hover { transform: translateX(4px); }
</style>
