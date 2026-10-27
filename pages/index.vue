<template>
  <div class="landing-page">
    <!-- Design read: sketch-note sharing app for people sending short-lived documents. Dials: ENERGY 2 / RHYTHM 3 / MOTION 2. Ruled paper makes the writing task feel familiar. Navy carries reading and navigation. Red marks the next action. -->
    <nav class="landing-nav">
      <div class="landing-nav-inner max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NuxtLink to="/" class="landing-brand">
          <span>OneTimeView</span>
        </NuxtLink>
        <div class="landing-nav-menu">
          <div class="landing-nav-links text-lg">
            <a href="#workflow">How it works</a>
            <NuxtLink to="/create-anonymous">Quick create</NuxtLink>
            <template v-if="user">
              <NuxtLink to="/create">New document</NuxtLink>
            </template>
            <template v-else>
              <NuxtLink to="/login">Log in</NuxtLink>
            </template>
          </div>
          <template v-if="user">
            <NuxtLink to="/dashboard" class="sketch-button sketch-button-primary landing-nav-cta">Your documents</NuxtLink>
          </template>
          <template v-else>
            <NuxtLink to="/register" class="sketch-button sketch-button-primary landing-nav-cta">Create an account</NuxtLink>
          </template>
        </div>
      </div>
    </nav>

    <main>
      <section ref="heroSection" class="landing-hero">
        <div>
          <h1 class="landing-title">Some notes are better with <span>an ending.</span></h1>
          <p class="landing-copy">
            Write in Markdown. Choose how many times a note can be opened and when its link expires. Then share one simple link.
          </p>
          <div class="landing-actions">
            <NuxtLink to="/create-anonymous" class="sketch-button sketch-button-primary">Write a note</NuxtLink>
            <a class="sketch-button sketch-button-plain" href="#workflow">See how it works</a>
          </div>
        </div>

        <article class="sample-sheet" aria-label="Example document preview">
          <div class="sample-sheet-inner">
            <div class="sheet-topline">
              <span>Markdown note</span>
              <span class="sheet-status">Preview</span>
            </div>
            <h2>A few things for <span class="sheet-underline">tomorrow</span></h2>
            <p>Bring the draft. We can leave comments together before the meeting.</p>
            <p><strong>Before we begin</strong></p>
            <p>Check the figures, add the latest notes, and send this page to the team.</p>
            <div class="sheet-meta">
              <span>Written in Markdown</span>
              <span aria-hidden="true">·</span>
              <span>Access has a limit</span>
            </div>
          </div>
        </article>
      </section>

      <section class="story-section" aria-labelledby="workflow-title">
        <div class="story-section-header">
          <h2 id="workflow-title">A link with a clear end point.</h2>
          <p>Keep the writing simple. Set the viewing limit before you share, then let the link expire on your terms.</p>
        </div>

        <div id="workflow" class="flow-list">
          <article class="flow-step">
            <span class="flow-step-number">01 / WRITE</span>
            <h3>Start with your words</h3>
            <p>Draft a note in the Markdown editor and check the preview as you write.</p>
          </article>
          <article class="flow-step">
            <span class="flow-step-number">02 / SET LIMITS</span>
            <h3>Choose when it ends</h3>
            <p>Set a maximum number of views and an expiry time for the shared link.</p>
          </article>
          <article class="flow-step">
            <span class="flow-step-number">03 / SHARE</span>
            <h3>Send one link</h3>
            <p>Share the link with its limits already in place.</p>
          </article>
        </div>
      </section>

      <section class="story-section" aria-labelledby="writing-title">
        <div class="story-section-header">
          <h2 id="writing-title">A familiar place to write.</h2>
          <p>Use headings, lists, links, and code blocks. Keep a document in your account, or make a quick note without signing in.</p>
        </div>
        <div class="closing-note">
          <div>
            <h2>Make the note. Set its limits.</h2>
            <p>Start with a quick note, or sign in to keep your documents together and manage them later.</p>
          </div>
          <div class="flex flex-wrap gap-3">
            <NuxtLink to="/create-anonymous" class="sketch-button sketch-button-primary">Quick create</NuxtLink>
            <NuxtLink to="/register" class="sketch-button">Create an account</NuxtLink>
          </div>
        </div>
      </section>
    </main>

    <footer class="landing-footer">
      <span>OneTimeView</span>
      <span>Notes with an ending.</span>
      <NuxtLink to="/login">Log in</NuxtLink>
    </footer>
  </div>
</template>

<script setup>
const user = ref(null)

onMounted(async () => {
  try {
    const { user: userData } = await $fetch('/api/auth/me')
    user.value = userData
  } catch {
    user.value = null
  }
})
</script>
