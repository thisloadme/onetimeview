<template>
  <div class="relative overflow-hidden">
    <!-- Navigation -->
    <nav ref="navbar" class="fixed top-0 left-0 right-0 z-50 transition-all duration-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-20">
          <div class="flex items-center">
            <NuxtLink to="/" class="flex items-center gap-3">
              <img src="/assets/images/logo.png" alt="OneTimeView" class="h-10 w-auto" />
              <span class="text-3xl font-bold text-gradient nav-logo">OneTimeView</span>
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <template v-if="user">
              <NuxtLink to="/create" class="text-white hover:text-[#1d6477] transition-colors">
                New Document
              </NuxtLink>
              <NuxtLink to="/dashboard" class="px-6 py-2 bg-white text-[#0e2e4f] font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                Dashboard
              </NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/create-anonymous" class="text-white hover:text-[#1d6477] transition-colors">
                Quick Create
              </NuxtLink>
              <NuxtLink to="/login" class="px-4 py-2 text-white border border-white/30 rounded-lg hover:bg-white/10 transition-all">
                Login
              </NuxtLink>
              <NuxtLink to="/register" class="px-6 py-2 bg-white text-[#0e2e4f] font-semibold rounded-lg hover:bg-gray-100 transition-all transform hover:scale-105">
                Get Started
              </NuxtLink>
            </template>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section ref="heroSection" class="relative min-h-screen flex items-center justify-center overflow-hidden hero-section">
      <!-- Parallax Background Layers -->
      <div class="absolute inset-0 overflow-hidden">
        <!-- Layer 1 - Background -->
        <div ref="heroBg1" class="hero-bg-layer absolute inset-0 bg-[#0e2e4f]"></div>
        
        <!-- Layer 2 - Floating Circles -->
        <div ref="heroBg2" class="hero-bg-layer absolute inset-0">
          <div class="absolute top-20 left-10 w-64 h-64 bg-[#1d6477]/10 rounded-full blur-3xl"></div>
          <div class="absolute bottom-20 right-10 w-96 h-96 bg-[#1d6477]/10 rounded-full blur-3xl"></div>
          <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#1d6477]/5 rounded-full blur-3xl"></div>
        </div>
        
        <!-- Layer 3 - Floating Shapes -->
        <div ref="heroBg3" class="hero-bg-layer absolute inset-0">
          <div class="floating-shape absolute top-1/4 left-1/4 w-20 h-20 bg-white/10 rounded-full animate-float" style="animation-delay: 0s;"></div>
          <div class="floating-shape absolute top-1/3 right-1/4 w-16 h-16 bg-white/10 rounded-full animate-float" style="animation-delay: 1s;"></div>
          <div class="floating-shape absolute bottom-1/4 left-1/3 w-24 h-24 bg-white/10 rounded-full animate-float" style="animation-delay: 2s;"></div>
          <div class="floating-shape absolute top-1/2 right-1/3 w-12 h-12 bg-white/10 rounded-full animate-float" style="animation-delay: 0.5s;"></div>
        </div>
        
        <!-- Layer 4 - Grid Pattern -->
        <div ref="heroBg4" class="hero-bg-layer absolute inset-0 opacity-10">
          <div class="absolute inset-0" style="background-image: linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px); background-size: 50px 50px;"></div>
        </div>
      </div>

      <!-- Hero Content -->
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-20">
        <div class="hero-content">
          <div class="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span class="text-blue-200 text-sm font-medium">🚀 Secure Document Sharing Made Simple</span>
          </div>
          <h1 class="text-5xl md:text-7xl lg:text-8xl font-bold text-white mb-6 leading-tight hero-title">
            Share Content
            <span class="block text-[#1d6477]">
              With Limited Access
            </span>
          </h1>
          <p class="text-xl md:text-2xl text-white/80 mb-10 max-w-3xl mx-auto hero-subtitle leading-relaxed">
            Create beautiful markdown documents and share them with links that automatically expire. Perfect for confidential business proposals, HR documents, and sensitive information.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center hero-buttons">
            <NuxtLink to="/create-anonymous" class="group px-8 py-4 bg-white text-[#0e2e4f] font-bold rounded-xl hover:bg-gray-100 transition-all transform hover:scale-105 shadow-2xl">
              <span class="flex items-center justify-center gap-2">
                Create Free Document
                <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            </NuxtLink>
            <button @click="scrollToFeatures" class="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
              See How It Works
            </button>
          </div>
          
          <!-- Scroll Indicator -->
          <div class="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
            <svg class="w-6 h-6 text-white/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
            </svg>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section ref="featuresSection" class="relative py-32 bg-gray-900 overflow-hidden">
      <!-- Background Pattern -->
      <div class="absolute inset-0 opacity-5">
        <div class="absolute inset-0" style="background-image: radial-gradient(circle at 2px 2px, rgba(255,255,255,0.3) 1px, transparent 0); background-size: 40px 40px;"></div>
      </div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20 features-header">
          <div class="inline-block mb-4 px-4 py-2 bg-[#0e2e4f]/50 rounded-full border border-[#0e2e4f]">
            <span class="text-[#0e2e4f] text-sm font-medium">✨ Powerful Features</span>
          </div>
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">
            Why Choose
            <span class="text-[#1d6477]">OneTimeView?</span>
          </h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            Built for modern teams who value security, simplicity, and control over their shared content.
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8 features-grid">
          <div class="feature-card group relative bg-gray-800 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-[#0e2e4f] transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-black/30">
            <div class="relative">
              <div class="w-20 h-20 bg-[#0e2e4f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">Secure by Design</h3>
              <p class="text-gray-400 leading-relaxed">Links automatically expire after a set number of views. No permanent exposure of sensitive content.</p>
            </div>
          </div>

          <div class="feature-card group relative bg-gray-800 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-[#1d6477] transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-black/30">
            <div class="relative">
              <div class="w-20 h-20 bg-[#1d6477] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">Rich Markdown Editor</h3>
              <p class="text-gray-400 leading-relaxed">Create beautiful documents with our intuitive markdown editor. Perfect for documentation, notes, and more.</p>
            </div>
          </div>

          <div class="feature-card group relative bg-gray-800 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-[#0e2e4f] transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl hover:shadow-black/30">
            <div class="relative">
              <div class="w-20 h-20 bg-[#0e2e4f] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-lg">
                <svg class="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path>
                </svg>
              </div>
              <h3 class="text-2xl font-bold text-white mb-3">Access Control</h3>
              <p class="text-gray-400 leading-relaxed">Set exactly how many times your document can be viewed. From one-time secrets to limited team shares.</p>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section ref="howItWorksSection" class="relative py-32 bg-gray-900 overflow-hidden">
      <!-- Background Decoration -->
      <div class="absolute top-0 left-0 w-96 h-96 bg-[#0e2e4f]/5 rounded-full blur-3xl"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-[#1d6477]/5 rounded-full blur-3xl"></div>
      
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20 how-header">
          <div class="inline-block mb-4 px-4 py-2 bg-[#1d6477]/50 rounded-full border border-[#1d6477]">
            <span class="text-[#1d6477] text-sm font-medium">🎯 Simple Process</span>
          </div>
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">
            How It
            <span class="text-[#1d6477]">Works</span>
          </h2>
          <p class="text-xl text-gray-400">
            Simple, secure, and straightforward document sharing in three easy steps.
          </p>
        </div>

        <div class="relative">
          <!-- Timeline Line -->
          <div ref="timelineLine" class="absolute left-1/2 top-0 bottom-0 w-1 bg-[#0e2e4f] rounded-full transform -translate-x-1/2 hidden md:block opacity-0"></div>

          <div class="space-y-24">
            <!-- Step 1 -->
            <div ref="step1" class="relative flex items-center how-step">
              <div class="flex-1 text-right pr-12">
                <div class="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-[#0e2e4f] transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl">
                  <h3 class="text-2xl font-bold text-white mb-3">Create Your Document</h3>
                  <p class="text-gray-400 leading-relaxed">Write your content using our markdown editor. Format text, add links, and create beautiful documents.</p>
                </div>
              </div>
              <div class="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-[#0e2e4f] rounded-full flex items-center justify-center shadow-lg border-4 border-gray-900 step-number">
                <span class="text-2xl font-bold text-white">1</span>
              </div>
              <div class="flex-1 pl-12 hidden md:block"></div>
            </div>

            <!-- Step 2 -->
            <div ref="step2" class="relative flex items-center how-step">
              <div class="flex-1 pr-12 hidden md:block"></div>
              <div class="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-[#1d6477] rounded-full flex items-center justify-center shadow-lg border-4 border-gray-900 step-number">
                <span class="text-2xl font-bold text-white">2</span>
              </div>
              <div class="flex-1 text-left pl-12">
                <div class="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-[#1d6477] transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl">
                  <h3 class="text-2xl font-bold text-white mb-3">Set Access Limits</h3>
                  <p class="text-gray-400 leading-relaxed">Choose how many times your document can be viewed and when the link should expire.</p>
                </div>
              </div>
            </div>

            <!-- Step 3 -->
            <div ref="step3" class="relative flex items-center how-step">
              <div class="flex-1 text-right pr-12">
                <div class="bg-gray-800 rounded-2xl p-8 border border-gray-700 hover:border-[#0e2e4f] transition-all duration-500 hover:transform hover:scale-105 hover:shadow-2xl">
                  <h3 class="text-2xl font-bold text-white mb-3">Share Securely</h3>
                  <p class="text-gray-400 leading-relaxed">Get a unique link and share it. The document will be automatically removed after the access limit is reached.</p>
                </div>
              </div>
              <div class="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 bg-[#0e2e4f] rounded-full flex items-center justify-center shadow-lg border-4 border-gray-900 step-number">
                <span class="text-2xl font-bold text-white">3</span>
              </div>
              <div class="flex-1 pl-12 hidden md:block"></div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Use Cases Section -->
    <section ref="useCasesSection" class="relative py-32 bg-gray-800 overflow-hidden">
      <div class="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="text-center mb-20 use-cases-header">
          <div class="inline-block mb-4 px-4 py-2 bg-[#1d6477]/50 rounded-full border border-[#1d6477]">
            <span class="text-[#1d6477] text-sm font-medium">💼 Versatile Solutions</span>
          </div>
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">
            Who Uses
            <span class="text-[#1d6477]">OneTimeView?</span>
          </h2>
          <p class="text-xl text-gray-400 max-w-2xl mx-auto">
            Trusted by professionals across industries who need secure, controlled document sharing.
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-6 use-cases-grid">
          <!-- Consultants -->
          <div ref="useCase1" class="use-case-card group relative bg-gray-800 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-[#0e2e4f] transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
            <div class="relative">
              <div class="w-16 h-16 bg-[#0e2e4f] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">Consultants</h3>
              <p class="text-gray-400 text-sm leading-relaxed mb-4">Share confidential proposals and strategic documents with clients.</p>
              <div class="p-3 bg-[#0e2e4f]/20 rounded-lg border border-[#0e2e4f]/50">
                <p class="text-[#0e2e4f] text-xs font-medium mb-1">Perfect for:</p>
                <p class="text-gray-300 text-xs">Proposals, strategic plans</p>
              </div>
            </div>
          </div>

          <!-- HR Professionals -->
          <div ref="useCase2" class="use-case-card group relative bg-gray-800 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-[#1d6477] transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
            <div class="relative">
              <div class="w-16 h-16 bg-[#1d6477] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">HR Professionals</h3>
              <p class="text-gray-400 text-sm leading-relaxed mb-4">Send employment contracts and sensitive HR documents securely.</p>
              <div class="p-3 bg-[#1d6477]/20 rounded-lg border border-[#1d6477]/50">
                <p class="text-[#1d6477] text-xs font-medium mb-1">Perfect for:</p>
                <p class="text-gray-300 text-xs">Contracts, offer letters</p>
              </div>
            </div>
          </div>

          <!-- Researchers -->
          <div ref="useCase3" class="use-case-card group relative bg-gray-800 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-[#0e2e4f] transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
            <div class="relative">
              <div class="w-16 h-16 bg-[#0e2e4f] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">Researchers</h3>
              <p class="text-gray-400 text-sm leading-relaxed mb-4">Share draft papers and research findings with collaborators.</p>
              <div class="p-3 bg-[#0e2e4f]/20 rounded-lg border border-[#0e2e4f]/50">
                <p class="text-[#0e2e4f] text-xs font-medium mb-1">Perfect for:</p>
                <p class="text-gray-300 text-xs">Draft papers, proposals</p>
              </div>
            </div>
          </div>

          <!-- Developers -->
          <div ref="useCase4" class="use-case-card group relative bg-gray-800 backdrop-blur-sm rounded-2xl p-6 border border-gray-700 hover:border-[#1d6477] transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl overflow-hidden">
            <div class="relative">
              <div class="w-16 h-16 bg-[#1d6477] rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                <svg class="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"></path>
                </svg>
              </div>
              <h3 class="text-xl font-bold text-white mb-2">Developers</h3>
              <p class="text-gray-400 text-sm leading-relaxed mb-4">Share internal documentation and technical specifications securely.</p>
              <div class="p-3 bg-[#1d6477]/20 rounded-lg border border-[#1d6477]/50">
                <p class="text-[#1d6477] text-xs font-medium mb-1">Perfect for:</p>
                <p class="text-gray-300 text-xs">API docs, guides</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Benefits Summary -->
        <div class="mt-20 benefits-summary">
          <div class="bg-gray-800 backdrop-blur-sm rounded-2xl p-8 border border-gray-700 hover:border-[#0e2e4f] transition-all duration-500">
            <div class="grid md:grid-cols-2 gap-8">
              <div>
                <h3 class="text-2xl font-bold text-white mb-4">Secure Document Sharing</h3>
                <p class="text-gray-400 leading-relaxed">
                  Whether you're sharing confidential business proposals, sensitive HR documents, unpublished research, or internal technical documentation, OneTimeView provides the security and control you need.
                </p>
              </div>
              <div class="grid grid-cols-2 gap-4">
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-gray-300">One-time access</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-gray-300">Auto expiration</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-gray-300">Access tracking</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-gray-300">No login required</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-gray-300">Markdown support</span>
                </div>
                <div class="flex items-center gap-3">
                  <div class="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                  <span class="text-gray-300">Professional look</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section ref="ctaSection" class="relative py-32 overflow-hidden">
      <!-- Animated Background -->
      <div class="absolute inset-0 bg-[#0e2e4f]">
        <!-- Particles Container -->
        <div ref="particlesContainer" class="absolute inset-0 overflow-hidden">
          <div class="particle absolute w-2 h-2 bg-white/20 rounded-full" style="top: 10%; left: 20%;"></div>
          <div class="particle absolute w-3 h-3 bg-white/15 rounded-full" style="top: 30%; left: 80%;"></div>
          <div class="particle absolute w-2 h-2 bg-white/20 rounded-full" style="top: 50%; left: 10%;"></div>
          <div class="particle absolute w-4 h-4 bg-white/10 rounded-full" style="top: 70%; left: 90%;"></div>
          <div class="particle absolute w-2 h-2 bg-white/20 rounded-full" style="top: 20%; left: 50%;"></div>
          <div class="particle absolute w-3 h-3 bg-white/15 rounded-full" style="top: 80%; left: 30%;"></div>
          <div class="particle absolute w-2 h-2 bg-white/20 rounded-full" style="top: 40%; left: 70%;"></div>
          <div class="particle absolute w-2 h-2 bg-white/20 rounded-full" style="top: 60%; left: 40%;"></div>
        </div>
        
        <!-- Floating Shapes -->
        <div ref="ctaShape1" class="cta-shape absolute w-64 h-64 bg-[#1d6477]/10 rounded-full blur-3xl" style="top: -100px; left: -100px;"></div>
        <div ref="ctaShape2" class="cta-shape absolute w-96 h-96 bg-[#1d6477]/10 rounded-full blur-3xl" style="bottom: -100px; right: -100px;"></div>
      </div>

      <div class="relative z-10 max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
        <div class="cta-content">
          <div class="inline-block mb-6 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full border border-white/20">
            <span class="text-blue-200 text-sm font-medium">🚀 Ready to get started?</span>
          </div>
          <h2 class="text-4xl md:text-6xl font-bold text-white mb-6">
            Share Documents
            <span class="block text-[#1d6477]">
              Securely & Privately
            </span>
          </h2>
          <p class="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who trust OneTimeView for their secure document sharing needs. Start creating documents in seconds.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <button ref="ctaPrimaryBtn" @click="navigateTo('/register')" class="cta-button group px-8 py-4 bg-white text-[#0e2e4f] font-bold rounded-xl hover:bg-gray-100 transition-all shadow-2xl">
              <span class="flex items-center justify-center gap-2">
                Get Started Free
                <svg class="w-5 h-5 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
                </svg>
              </span>
            </button>
            <button @click="navigateTo('/create-anonymous')" class="px-8 py-4 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-xl border border-white/30 hover:bg-white/20 transition-all">
              Create Anonymous Document
            </button>
          </div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-950 text-white py-16">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="grid md:grid-cols-4 gap-12 mb-12">
          <div class="md:col-span-2">
            <div class="flex items-center gap-3 mb-4">
              <img src="/assets/images/logo.png" alt="OneTimeView" class="h-10 w-auto" />
              <h3 class="text-2xl font-bold text-gradient">OneTimeView</h3>
            </div>
            <p class="text-gray-500 mb-4 max-w-md">Secure markdown sharing made simple. Share documents with confidence knowing they'll expire after use.</p>
            <div class="flex space-x-4">
              <a href="#" class="text-gray-500 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557c-.883.392-1.832.656-2.828.775 1.017-.609 1.798-1.574 2.165-2.724-.951.564-2.005.974-3.127 1.195-.897-.957-2.178-1.555-3.594-1.555-3.179 0-5.515 2.966-4.797 6.045-4.091-.205-7.719-2.165-10.148-5.144-1.29 2.213-.669 5.108 1.523 6.574-.806-.026-1.566-.247-2.229-.616-.054 2.281 1.581 4.415 3.949 4.89-.693.188-1.452.232-2.224.084.626 1.956 2.444 3.379 4.6 3.419-2.07 1.623-4.678 2.348-7.29 2.04 2.179 1.397 4.768 2.212 7.548 2.212 9.142 0 14.307-7.721 13.995-14.646.962-.695 1.797-1.562 2.457-2.549z"/></svg>
              </a>
              <a href="#" class="text-gray-500 hover:text-white transition-colors">
                <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              </a>
            </div>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Product</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-500 hover:text-white transition-colors">Features</a></li>
              <li><a href="#" class="text-gray-500 hover:text-white transition-colors">Pricing</a></li>
              <li><a href="#" class="text-gray-500 hover:text-white transition-colors">Use Cases</a></li>
              <li><a href="/create-anonymous" class="text-gray-500 hover:text-white transition-colors">Try It Free</a></li>
            </ul>
          </div>
          <div>
            <h4 class="font-semibold mb-4">Company</h4>
            <ul class="space-y-2">
              <li><a href="#" class="text-gray-500 hover:text-white transition-colors">About</a></li>
              <li><a href="#" class="text-gray-500 hover:text-white transition-colors">Blog</a></li>
              <li><a href="#" class="text-gray-500 hover:text-white transition-colors">Privacy</a></li>
              <li><a href="#" class="text-gray-500 hover:text-white transition-colors">Terms</a></li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-800 pt-8 text-center">
          <p class="text-gray-600">&copy; 2025 OneTimeView. All rights reserved.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

// Refs
const navbar = ref(null)
const heroSection = ref(null)
const heroBg1 = ref(null)
const heroBg2 = ref(null)
const heroBg3 = ref(null)
const heroBg4 = ref(null)
const featuresSection = ref(null)
const timelineLine = ref(null)
const ctaSection = ref(null)
const ctaPrimaryBtn = ref(null)

const user = ref(null)

onMounted(async () => {
  // Check auth status
  try {
    const { user: userData } = await $fetch('/api/auth/me')
    user.value = userData
  } catch (err) {
    // User is not logged in, ignore
  }

  // Navbar scroll effect
  gsap.to(navbar.value, {
    scrollTrigger: {
      trigger: heroSection.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    },
    backgroundColor: 'rgba(17, 24, 39, 0.95)',
    backdropFilter: 'blur(10px)',
    borderBottomColor: 'rgba(255, 255, 255, 0.1)'
  })

  // Hero animations
  const heroTl = gsap.timeline()
  
  // Parallax background layers
  gsap.to(heroBg1.value, {
    yPercent: -30,
    scrollTrigger: {
      trigger: heroSection.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
  
  gsap.to(heroBg2.value, {
    yPercent: -50,
    scrollTrigger: {
      trigger: heroSection.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
  
  gsap.to(heroBg3.value, {
    yPercent: -70,
    scrollTrigger: {
      trigger: heroSection.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })
  
  gsap.to(heroBg4.value, {
    yPercent: -20,
    scrollTrigger: {
      trigger: heroSection.value,
      start: 'top top',
      end: 'bottom top',
      scrub: true
    }
  })

  // Hero content fade in
  heroTl.from('.hero-content > *', {
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: 'power3.out'
  })

  // Features section animations
  gsap.from('.features-header > *', {
    scrollTrigger: {
      trigger: featuresSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  })

  gsap.from('.feature-card', {
    scrollTrigger: {
      trigger: '.features-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  })

  // How it works section
  gsap.from('.how-header > *', {
    scrollTrigger: {
      trigger: document.querySelector('[ref="howItWorksSection"]'),
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  })

  // Timeline line animation
  gsap.to(timelineLine.value, {
    scrollTrigger: {
      trigger: document.querySelector('[ref="howItWorksSection"]'),
      start: 'top 70%',
      end: 'bottom 30%',
      scrub: true
    },
    opacity: 1,
    scaleY: 1,
    transformOrigin: 'top center'
  })

  // Steps animation
  gsap.from('.how-step', {
    scrollTrigger: {
      trigger: '.how-step',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    x: -100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.3,
    ease: 'power3.out'
  })

  // Use cases section
  gsap.from('.use-cases-header > *', {
    scrollTrigger: {
      trigger: document.querySelector('[ref="useCasesSection"]'),
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  })

  gsap.from('.use-case-card', {
    scrollTrigger: {
      trigger: '.use-cases-grid',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 100,
    opacity: 0,
    duration: 0.8,
    stagger: 0.15,
    ease: 'power3.out'
  })

  // Benefits summary
  gsap.from('.benefits-summary > div', {
    scrollTrigger: {
      trigger: '.benefits-summary',
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    ease: 'power3.out'
  })

  // CTA section
  gsap.from('.cta-content > *', {
    scrollTrigger: {
      trigger: ctaSection.value,
      start: 'top 80%',
      toggleActions: 'play none none reverse'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: 0.2,
    ease: 'power3.out'
  })

  // CTA button magnetic effect
  if (ctaPrimaryBtn.value) {
    ctaPrimaryBtn.value.addEventListener('mousemove', (e) => {
      const rect = ctaPrimaryBtn.value.getBoundingClientRect()
      const x = e.clientX - rect.left - rect.width / 2
      const y = e.clientY - rect.top - rect.height / 2
      
      gsap.to(ctaPrimaryBtn.value, {
        x: x * 0.1,
        y: y * 0.1,
        duration: 0.3,
        ease: 'power2.out'
      })
    })

    ctaPrimaryBtn.value.addEventListener('mouseleave', () => {
      gsap.to(ctaPrimaryBtn.value, {
        x: 0,
        y: 0,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  }

  // Particles animation
  gsap.to('.particle', {
    y: -100,
    x: (i) => gsap.utils.random(-50, 50),
    duration: (i) => 3 + Math.random() * 2,
    repeat: -1,
    yoyo: true,
    ease: 'sine.inOut',
    stagger: 0.5
  })

  // CTA shapes parallax
  gsap.to('.cta-shape', {
    yPercent: -50,
    scrollTrigger: {
      trigger: ctaSection.value,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true
    }
  })
})

const scrollToFeatures = () => {
  featuresSection.value?.scrollIntoView({ behavior: 'smooth' })
}
</script>

<style>
@keyframes float {
  0%, 100% { transform: translateY(0) rotate(0deg); }
  50% { transform: translateY(-20px) rotate(5deg); }
}

.animate-float {
  animation: float 6s ease-in-out infinite;
}

.hero-section {
  background: #0e2e4f;
}

.btn-primary {
  background: #0e2e4f;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background: #1d6477;
  transform: translateY(-2px);
  box-shadow: 0 10px 20px rgba(14, 46, 79, 0.3);
}

.btn-secondary {
  background: transparent;
  color: white;
  padding: 0.75rem 1.5rem;
  border-radius: 0.5rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.5);
}

.card {
  background: rgba(17, 24, 39, 0.5);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 1rem;
  transition: all 0.3s ease;
}

.card:hover {
  transform: translateY(-4px);
  border-color: rgba(255, 255, 255, 0.2);
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
}

.nav-bg {
  background: rgba(17, 24, 39, 0.8);
  backdrop-filter: blur(10px);
}
</style>