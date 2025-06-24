// Simple HTML sanitization without external dependencies
// This is safe for Edge Runtime and middleware
function stripHtmlTags(input: string): string {
  if (!input || typeof input !== 'string') return ''

  // Remove HTML tags
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&lt;/g, '<')   // Decode HTML entities
    .replace(/&gt;/g, '>')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#x2F;/g, '/')
}

// Sanitize HTML content (server-safe version)
export function sanitizeHtml(dirty: string): string {
  return stripHtmlTags(dirty)
}

// Sanitize text input (removes HTML and dangerous characters)
export function sanitizeText(input: string): string {
  if (!input || typeof input !== 'string') return ''
  
  // Remove HTML tags and decode entities
  const sanitized = sanitizeHtml(input)
  
  // Remove potentially dangerous characters
  return sanitized
    .replace(/[<>]/g, '') // Remove angle brackets
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Sanitize email
export function sanitizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return ''
  
  return email
    .toLowerCase()
    .trim()
    .replace(/[^\w@.-]/g, '') // Only allow word chars, @, ., and -
}

// Sanitize phone number
export function sanitizePhone(phone: string): string {
  if (!phone || typeof phone !== 'string') return ''
  
  return phone
    .replace(/[^\d\s\-\(\)\+]/g, '') // Only allow digits, spaces, dashes, parentheses, plus
    .trim()
}

// Rate limiting utilities
interface RateLimitEntry {
  count: number
  resetTime: number
}

const rateLimitStore = new Map<string, RateLimitEntry>()

export function checkRateLimit(
  identifier: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number; resetTime: number } {
  const now = Date.now()
  const key = identifier
  
  // Clean up expired entries
  for (const [k, v] of rateLimitStore.entries()) {
    if (v.resetTime <= now) {
      rateLimitStore.delete(k)
    }
  }
  
  const entry = rateLimitStore.get(key)
  
  if (!entry) {
    // First request
    rateLimitStore.set(key, {
      count: 1,
      resetTime: now + windowMs
    })
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: now + windowMs
    }
  }
  
  if (entry.resetTime <= now) {
    // Window expired, reset
    entry.count = 1
    entry.resetTime = now + windowMs
    return {
      allowed: true,
      remaining: limit - 1,
      resetTime: entry.resetTime
    }
  }
  
  if (entry.count >= limit) {
    // Rate limit exceeded
    return {
      allowed: false,
      remaining: 0,
      resetTime: entry.resetTime
    }
  }
  
  // Increment count
  entry.count++
  return {
    allowed: true,
    remaining: limit - entry.count,
    resetTime: entry.resetTime
  }
}

// Generate CSRF token
export function generateCSRFToken(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID()
  }
  
  // Fallback for older environments
  return Math.random().toString(36).substring(2) + Date.now().toString(36)
}

// Validate CSRF token (simple implementation)
export function validateCSRFToken(token: string, sessionToken: string): boolean {
  return token === sessionToken && token.length > 10
}

// Security headers for API responses
export const securityHeaders = {
  'X-Content-Type-Options': 'nosniff',
  'X-Frame-Options': 'DENY',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
  'Pragma': 'no-cache',
  'Expires': '0'
}

// Validate environment variables
export function validateEnvironment() {
  const requiredVars = [
    'NEXT_PUBLIC_SUPABASE_URL',
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    'SUPABASE_SERVICE_ROLE_KEY'
  ]
  
  const missing = requiredVars.filter(varName => !process.env[varName])
  
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`)
  }
}

// Log security events (in production, send to monitoring service)
export function logSecurityEvent(event: string, details: Record<string, any>) {
  const logEntry = {
    timestamp: new Date().toISOString(),
    event,
    details,
    userAgent: typeof window !== 'undefined' ? window.navigator.userAgent : 'server',
    ip: 'unknown' // Would be populated by middleware in real implementation
  }
  
  if (process.env.NODE_ENV === 'development') {
    console.warn('Security Event:', logEntry)
  }
  
  // In production, send to monitoring service
  // Example: sendToMonitoringService(logEntry)
}
