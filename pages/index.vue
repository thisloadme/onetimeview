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
          Create beautiful markdown documents and share them with links that automatically expire after a set number of views. Perfect for consultants, HR professionals, researchers, and developers who need secure, controlled document sharing.
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
            Simple, secure, and straightforward document sharing in three easy steps. Perfect for consultants, HR professionals, researchers, and developers.
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

    <!-- Target Users Section -->
    <section class="py-20 bg-gray-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-16">
          <h2 class="text-4xl font-bold text-gray-100 mb-4">
            Who Uses OneTimeView?
          </h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            Trusted by professionals across industries who need secure, controlled document sharing for sensitive information.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          <!-- Consultants -->
          <div class="card text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div class="w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Consultants</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Share confidential proposals and strategic documents with clients. Control access to sensitive business information and ensure proposals remain private until decisions are made.
            </p>
            <div class="mt-4 p-3 bg-indigo-900/20 rounded-lg border border-indigo-800">
              <p class="text-indigo-400 text-xs font-medium">Perfect for:</p>
              <p class="text-gray-300 text-xs">Business proposals, strategic plans, confidential reports</p>
            </div>
          </div>

          <!-- HR Professionals -->
          <div class="card text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div class="w-16 h-16 bg-gradient-to-r from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">HR Professionals</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Send employment contracts and sensitive HR documents securely. Ensure candidates can only view their contracts once and maintain confidentiality throughout the hiring process.
            </p>
            <div class="mt-4 p-3 bg-green-900/20 rounded-lg border border-green-800">
              <p class="text-green-400 text-xs font-medium">Perfect for:</p>
              <p class="text-gray-300 text-xs">Employment contracts, offer letters, HR policies</p>
            </div>
          </div>

          <!-- Researchers -->
          <div class="card text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div class="w-16 h-16 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Researchers</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Share draft papers and research findings with collaborators. Control who sees your work and when, ensuring your research remains confidential until publication.
            </p>
            <div class="mt-4 p-3 bg-purple-900/20 rounded-lg border border-purple-800">
              <p class="text-purple-400 text-xs font-medium">Perfect for:</p>
              <p class="text-gray-300 text-xs">Draft papers, research proposals, preliminary findings</p>
            </div>
          </div>

          <!-- Developers -->
          <div class="card text-center group hover:transform hover:scale-105 transition-all duration-300">
            <div class="w-16 h-16 bg-gradient-to-r from-orange-600 to-red-600 rounded-xl flex items-center justify-center mx-auto mb-4 group-hover:shadow-lg">
              <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
              </svg>
            </div>
            <h3 class="text-xl font-semibold text-gray-100 mb-2">Developers</h3>
            <p class="text-gray-400 text-sm leading-relaxed">
              Share internal documentation and technical specifications securely. Control access to sensitive code documentation and ensure only authorized team members can view internal resources.
            </p>
            <div class="mt-4 p-3 bg-orange-900/20 rounded-lg border border-orange-800">
              <p class="text-orange-400 text-xs font-medium">Perfect for:</p>
              <p class="text-gray-300 text-xs">API docs, internal guides, technical specs</p>
            </div>
          </div>
        </div>

        <!-- Use Cases Summary -->
        <div class="mt-16 text-center">
          <div class="bg-gray-700/50 rounded-xl p-8 border border-gray-600">
            <h3 class="text-2xl font-bold text-gray-100 mb-4">
              Secure Document Sharing for Every Industry
            </h3>
            <p class="text-gray-400 mb-6 max-w-3xl mx-auto">
              Whether you're sharing confidential business proposals, sensitive HR documents, unpublished research, or internal technical documentation, OneTimeView provides the security and control you need.
            </p>
            <div class="grid md:grid-cols-2 gap-6 text-left max-w-4xl mx-auto">
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span class="text-gray-300">One-time access links</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span class="text-gray-300">Automatic expiration</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span class="text-gray-300">Access tracking & analytics</span>
                </div>
              </div>
              <div class="space-y-3">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span class="text-gray-300">No registration required for viewers</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span class="text-gray-300">Markdown formatting support</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span class="text-gray-300">Professional document presentation</span>
                </div>
              </div>
            </div>
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
          Join consultants, HR professionals, researchers, and developers who trust OneTimeView for their secure document sharing needs.
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