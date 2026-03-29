type LogLevel = 'debug' | 'info' | 'warn' | 'error'

interface LogEntry {
  level: LogLevel
  message: string
  data?: unknown
  timestamp: string
}

const isDev = process.env.NODE_ENV === 'development'

function formatLog(level: LogLevel, message: string, data?: unknown): LogEntry {
  return {
    level,
    message,
    data,
    timestamp: new Date().toISOString(),
  }
}

function sendToSentry(level: LogLevel, message: string, data?: unknown) {
  if (typeof window !== 'undefined' && level === 'error') {
    // Dynamic import to avoid SSR issues
    import('@sentry/nextjs').then(Sentry => {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: data as Record<string, unknown>,
      })
    })
  }
}

export const logger = {
  debug: (message: string, data?: unknown) => {
    if (!isDev) return
    const entry = formatLog('debug', message, data)
    console.debug(`[DEBUG] ${entry.timestamp} - ${message}`, data ?? '')
  },

  info: (message: string, data?: unknown) => {
    const entry = formatLog('info', message, data)
    if (isDev) {
      console.info(`[INFO] ${entry.timestamp} - ${message}`, data ?? '')
    }
  },

  warn: (message: string, data?: unknown) => {
    const entry = formatLog('warn', message, data)
    console.warn(`[WARN] ${entry.timestamp} - ${message}`, data ?? '')
  },

  error: (message: string, data?: unknown) => {
    const entry = formatLog('error', message, data)
    console.error(`[ERROR] ${entry.timestamp} - ${message}`, data ?? '')
    sendToSentry('error', message, data)
  },
}
