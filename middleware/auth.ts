export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.server) return

  try {
    await $fetch('/api/auth/me')
  } catch (error) {
    return navigateTo('/login')
  }
})