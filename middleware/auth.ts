export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  try {
    await $fetch('/api/auth/me')
  } catch (error) {
    // Redirect to login with return URL
    return navigateTo(`/login?redirect=${encodeURIComponent(to.fullPath)}`)
  }
})