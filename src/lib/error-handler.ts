import { NextResponse } from 'next/server'
import { ZodError } from 'zod'
import { logSecurityEvent } from './security'
import { isProduction } from './env'

// Error types
export class AppError extends Error {
  constructor(
    message: string,
    public statusCode: number = 500,
    public code?: string,
    public isOperational: boolean = true
  ) {
    super(message)
    this.name = 'AppError'
    Object.setPrototypeOf(this, AppError.prototype)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public details?: Record<string, string[]>) {
    super(message, 400, 'VALIDATION_ERROR')
    this.name = 'ValidationError'
  }
}

export class RateLimitError extends AppError {
  constructor(message: string = 'Rate limit exceeded', public retryAfter?: number) {
    super(message, 429, 'RATE_LIMIT_ERROR')
    this.name = 'RateLimitError'
  }
}

export class SecurityError extends AppError {
  constructor(message: string = 'Security violation detected') {
    super(message, 403, 'SECURITY_ERROR')
    this.name = 'SecurityError'
  }
}

// Safe error response (doesn't expose sensitive information)
export function createErrorResponse(error: unknown, request?: Request): NextResponse {
  let statusCode = 500
  let message = 'Internal server error'
  let code = 'INTERNAL_ERROR'
  let details: any = undefined

  // Log the original error for debugging
  const errorId = Math.random().toString(36).substring(2, 15)
  
  if (error instanceof AppError) {
    statusCode = error.statusCode
    message = error.message
    code = error.code || 'APP_ERROR'
    
    if (error instanceof ValidationError) {
      details = error.details
    }
    
    if (error instanceof RateLimitError && error.retryAfter) {
      // Add retry-after header for rate limiting
    }
  } else if (error instanceof ZodError) {
    statusCode = 400
    message = 'Validation failed'
    code = 'VALIDATION_ERROR'
    details = error.errors.reduce((acc, err) => {
      const path = err.path.join('.')
      if (!acc[path]) acc[path] = []
      acc[path].push(err.message)
      return acc
    }, {} as Record<string, string[]>)
  } else if (error instanceof Error) {
    // Log unexpected errors
    logSecurityEvent('unexpected_error', {
      errorId,
      message: error.message,
      stack: isProduction ? undefined : error.stack,
      url: request?.url,
      method: request?.method
    })
    
    // Don't expose internal error details in production
    if (!isProduction) {
      message = error.message
    }
  }

  // Log security-related errors
  if (statusCode === 403 || statusCode === 429) {
    logSecurityEvent('security_error', {
      errorId,
      statusCode,
      message,
      code,
      url: request?.url,
      method: request?.method,
      userAgent: request?.headers.get('user-agent')
    })
  }

  const responseBody: any = {
    error: true,
    code,
    message,
    errorId: isProduction ? errorId : undefined
  }

  if (details) {
    responseBody.details = details
  }

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY'
  }

  // Add retry-after header for rate limiting
  if (error instanceof RateLimitError && error.retryAfter) {
    headers['Retry-After'] = error.retryAfter.toString()
  }

  return NextResponse.json(responseBody, {
    status: statusCode,
    headers
  })
}

// Global error handler for API routes
export function withErrorHandler(handler: Function) {
  return async (request: Request, context?: any) => {
    try {
      return await handler(request, context)
    } catch (error) {
      return createErrorResponse(error, request)
    }
  }
}

// Async error handler
export function handleAsyncError(fn: Function) {
  return (req: any, res: any, next: any) => {
    Promise.resolve(fn(req, res, next)).catch(next)
  }
}

// Error boundary for React components
export class ErrorBoundary extends Error {
  constructor(message: string, public originalError?: Error) {
    super(message)
    this.name = 'ErrorBoundary'
  }
}

// Sanitize error for client-side logging
export function sanitizeErrorForClient(error: unknown): {
  message: string
  code?: string
  timestamp: string
} {
  let message = 'An unexpected error occurred'
  let code: string | undefined

  if (error instanceof AppError) {
    message = error.message
    code = error.code
  } else if (error instanceof Error && !isProduction) {
    message = error.message
  }

  return {
    message,
    code,
    timestamp: new Date().toISOString()
  }
}

// Helper to check if error is operational (expected) vs programming error
export function isOperationalError(error: unknown): boolean {
  if (error instanceof AppError) {
    return error.isOperational
  }
  return false
}

// Process exit handler for unhandled errors
export function setupGlobalErrorHandlers() {
  process.on('uncaughtException', (error) => {
    logSecurityEvent('uncaught_exception', {
      message: error.message,
      stack: error.stack
    })
    
    if (!isOperationalError(error)) {
      process.exit(1)
    }
  })

  process.on('unhandledRejection', (reason, promise) => {
    logSecurityEvent('unhandled_rejection', {
      reason: reason instanceof Error ? reason.message : String(reason),
      stack: reason instanceof Error ? reason.stack : undefined
    })
    
    if (!isOperationalError(reason)) {
      process.exit(1)
    }
  })
}
