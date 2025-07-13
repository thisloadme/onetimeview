<template>
  <div>
    <!-- Navigation -->
    <nav class="nav-bg border-b sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <div class="flex items-center">
            <h1 class="text-2xl font-bold text-gradient">
              OneTimeView
            </h1>
          </div>
          <div class="flex space-x-4">
            <NuxtLink to="/login" class="btn-secondary">
              Login
            </NuxtLink>
            <NuxtLink to="/register" class="btn-primary">
              Get Started
            </NuxtLink>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative py-20 overflow-hidden hero-gradient">
      <div class="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
      <div class="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 class="text-5xl md:text-6xl font-bold text-gray-100 mb-6">
          Share Markdown Content
          <span class="block text-gradient">
            With Limited Access
          </span>
        </h1>
        <p class="text-xl text-gray-400 mb-8 max-w-3xl mx-auto">
          Create beautiful markdown documents and share them with links that automatically expire after a set number of views. Perfect for secure, temporary document sharing.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink to="/register" class="btn-primary text-lg px-8 py-3">
            Start Creating Free
          </NuxtLink>
          <button @click="scrollToFeatures" class="btn-secondary text-lg px-8 py-3">
            Learn More
          </button>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="py-20 bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-100 mb-4">
            Why Choose OneTimeView?
          </h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            Built for modern teams who value security, simplicity, and control over their shared content.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="card text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Secure by Design</h3>
            <p class="text-gray-400">Links automatically expire after the set number of views. No permanent exposure of sensitive content.</p>
          </div>

          <div class="card text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Rich Markdown Editor</h3>
            <p class="text-gray-400">Create beautiful documents with our intuitive markdown editor. Perfect for documentation, notes, and more.</p>
          </div>

          <div class="card text-center">
            <div class="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Access Control</h3>
            <p class="text-gray-400">Set exactly how many times your document can be viewed. From one-time secrets to limited team shares.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 bg-gray-900">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-100 mb-4">
            How It Works
          </h2>
          <p class="text-xl text-gray-400">
            Simple, secure, and straightforward document sharing in three easy steps.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div class="text-center">
            <div class="w-12 h-12 bg-blue-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              1
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Create Your Document</h3>
            <p class="text-gray-400">Write your content using our markdown editor. Format text, add links, and create beautiful documents.</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              2
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Set Access Limits</h3>
            <p class="text-gray-400">Choose how many times your document can be viewed and when the link should expire.</p>
          </div>

          <div class="text-center">
            <div class="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
              3
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Share Securely</h3>
            <p class="text-gray-400">Get a unique link and share it. The document will be automatically removed after the access limit is reached.</p>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
      <div class="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <h2 class="text-4xl font-bold text-white mb-4">
          Ready to Share Securely?
        </h2>
        <p class="text-xl text-blue-100 mb-8">
          Join thousands of users who trust OneTimeView for their secure document sharing needs.
        </p>
        <NuxtLink to="/register" class="bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-200 transform hover:scale-105 inline-block">
          Get Started for Free
        </NuxtLink>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-950 text-white py-12">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center">
          <h3 class="text-2xl font-bold mb-4">OneTimeView</h3>
          <p class="text-gray-500 mb-4">Secure markdown sharing made simple.</p>
          <div class="flex justify-center space-x-6">
            <a href="#" class="text-gray-500 hover:text-white transition duration-200">Privacy</a>
            <a href="#" class="text-gray-500 hover:text-white transition duration-200">Terms</a>
            <a href="#" class="text-gray-500 hover:text-white transition duration-200">Support</a>
          </div>
          <p class="text-gray-600 mt-8">&copy; 2025 OneTimeView. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
const featuresSection = ref()

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>