export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  try {
    await $fetch('/api/auth/me')
    // User is authenticated, redirect to dashboard
    return navigateTo('/dashboard')
  } catch (error) {
    // User is not authenticated, allow access to guest pages
    return
  }
}) 