/**
 * Simple in-memory sliding-window rate limiter.
 * Tracks requests per IP within a time window.
 * Resets automatically when window expires.
 */

interface RateLimitEntry {
  count: number
  resetAt: number
}

const store = new Map<string, RateLimitEntry>()

// Cleanup stale entries every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [key, entry] of store) {
      if (now > entry.resetAt) {
        store.delete(key)
      }
    }
  }, 5 * 60 * 1000)
}

export interface RateLimitOptions {
  /** Max requests allowed in the window */
  maxRequests: number
  /** Window duration in seconds */
  windowSeconds: number
}

const defaultOptions: RateLimitOptions = {
  maxRequests: 10,
  windowSeconds: 60
}

/**
 * Check if a request is rate-limited.
 * Returns { allowed: true } or { allowed: false, retryAfter }.
 */
export function checkRateLimit(
  key: string,
  options: Partial<RateLimitOptions> = {}
): { allowed: true } | { allowed: false; retryAfter: number } {
  const opts = { ...defaultOptions, ...options }
  const now = Date.now()
  const entry = store.get(key)

  if (!entry || now > entry.resetAt) {
    // First request or window expired
    store.set(key, {
      count: 1,
      resetAt: now + opts.windowSeconds * 1000
    })
    return { allowed: true }
  }

  if (entry.count >= opts.maxRequests) {
    const retryAfter = Math.ceil((entry.resetAt - now) / 1000)
    return { allowed: false, retryAfter }
  }

  entry.count++
  return { allowed: true }
}

/**
 * Create a rate-limited event handler wrapper for Nitro.
 */
export function withRateLimit(
  handler: (event: any) => Promise<any>,
  options: Partial<RateLimitOptions> = {}
) {
  return defineEventHandler(async (event) => {
    const ip = getRequestIP(event) || 'unknown'
    const route = getRequestURL(event).pathname
    const key = `${ip}:${route}`

    const result = checkRateLimit(key, options)
    if (!result.allowed) {
      throw createError({
        statusCode: 429,
        statusMessage: `Too many requests. Try again in ${result.retryAfter} seconds.`
      })
    }

    return handler(event)
  })
}
