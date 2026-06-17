/**
 * P3.6: Simple structured logger for application-wide use.
 * In production, replace with pino/consola for better perf.
 */

type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  timestamp: string
  requestId?: string
  [key: string]: unknown
}

function generateRequestId(): string {
  return Math.random().toString(36).substring(2, 10) + Date.now().toString(36)
}

function createLogEntry(level: LogLevel, message: string, meta?: Record<string, unknown>): LogEntry {
  return {
    level,
    message,
    timestamp: new Date().toISOString(),
    requestId: generateRequestId(),
    ...meta
  }
}

function formatLog(entry: LogEntry): string {
  // In production, JSON output is better for log aggregators
  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify(entry)
  }
  // In development, human-readable
  const emoji = entry.level === 'error' ? '❌' : entry.level === 'warn' ? '⚠️' : entry.level === 'info' ? 'ℹ️' : '🔍'
  const metaStr = entry.requestId ? ` [${entry.requestId}]` : ''
  return `${emoji} ${entry.message}${metaStr}`
}

export const logger = {
  debug(message: string, meta?: Record<string, unknown>) {
    const entry = createLogEntry('debug', message, meta)
    console.debug(formatLog(entry))
  },

  info(message: string, meta?: Record<string, unknown>) {
    const entry = createLogEntry('info', message, meta)
    console.log(formatLog(entry))
  },

  warn(message: string, meta?: Record<string, unknown>) {
    const entry = createLogEntry('warn', message, meta)
    console.warn(formatLog(entry))
  },

  error(message: string, meta?: Record<string, unknown>) {
    const entry = createLogEntry('error', message, meta)
    console.error(formatLog(entry))
  },

  /**
   * Create a child logger with pre-filled metadata (e.g., request context).
   */
  child(defaultMeta: Record<string, unknown>) {
    return {
      debug: (message: string, meta?: Record<string, unknown>) =>
        this.debug(message, { ...defaultMeta, ...meta }),
      info: (message: string, meta?: Record<string, unknown>) =>
        this.info(message, { ...defaultMeta, ...meta }),
      warn: (message: string, meta?: Record<string, unknown>) =>
        this.warn(message, { ...defaultMeta, ...meta }),
      error: (message: string, meta?: Record<string, unknown>) =>
        this.error(message, { ...defaultMeta, ...meta }),
    }
  }
}
