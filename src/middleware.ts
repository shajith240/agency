import { NextRequest, NextResponse } from 'next/server'
import { checkRateLimit, securityHeaders, logSecurityEvent } from '@/lib/security'
import { isProduction } from '@/lib/env'

// Rate limiting configuration
const RATE_LIMITS = {
  '/api/contact': { limit: 5, window: 60000 }, // 5 requests per minute
  '/api/': { limit: 100, window: 60000 }, // 100 requests per minute for other API routes
  default: { limit: 200, window: 60000 } // 200 requests per minute for pages
}

export function middleware(request: NextRequest) {
  const requestUrl = request.nextUrl.clone()

  // HTTPS enforcement in production
  if (isProduction && requestUrl.protocol === 'http:') {
    requestUrl.protocol = 'https:'
    return NextResponse.redirect(requestUrl)
  }

  const response = NextResponse.next()

  // Add security headers to all responses
  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  // Secure cookie settings
  if (isProduction) {
    response.headers.set(
      'Set-Cookie',
      response.headers.get('Set-Cookie')?.replace(/; Secure/g, '') + '; Secure; SameSite=Strict' || ''
    )
  }

  // Get client identifier (IP + User Agent hash)
  const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
    request.headers.get('x-real-ip') ||
    'unknown'
  
  const userAgent = request.headers.get('user-agent') || 'unknown'
  const clientId = `${clientIP}-${Buffer.from(userAgent).toString('base64').slice(0, 10)}`

  // Determine rate limit based on path
  const path = request.nextUrl.pathname
  let rateConfig = RATE_LIMITS.default
  
  for (const [pattern, config] of Object.entries(RATE_LIMITS)) {
    if (pattern !== 'default' && path.startsWith(pattern)) {
      rateConfig = config
      break
    }
  }

  // Check rate limit
  const rateCheck = checkRateLimit(clientId, rateConfig.limit, rateConfig.window)
  
  if (!rateCheck.allowed) {
    logSecurityEvent('rate_limit_exceeded', {
      clientId,
      path,
      ip: clientIP,
      userAgent
    })
    
    return new NextResponse(
      JSON.stringify({ 
        error: 'Rate limit exceeded',
        retryAfter: Math.ceil((rateCheck.resetTime - Date.now()) / 1000)
      }),
      {
        status: 429,
        headers: {
          'Content-Type': 'application/json',
          'Retry-After': Math.ceil((rateCheck.resetTime - Date.now()) / 1000).toString(),
          ...securityHeaders
        }
      }
    )
  }

  // Add rate limit headers
  response.headers.set('X-RateLimit-Limit', rateConfig.limit.toString())
  response.headers.set('X-RateLimit-Remaining', rateCheck.remaining.toString())
  response.headers.set('X-RateLimit-Reset', Math.ceil(rateCheck.resetTime / 1000).toString())

  // Security checks for suspicious requests
  const suspiciousPatterns = [
    /\.\./,  // Path traversal
    /<script/i,  // XSS attempts
    /union.*select/i,  // SQL injection
    /javascript:/i,  // JavaScript protocol
    /data:/i,  // Data URLs
    /vbscript:/i  // VBScript
  ]

  const urlString = request.nextUrl.toString()
  const body = request.body ? request.body.toString() : ''

  if (suspiciousPatterns.some(pattern => pattern.test(urlString) || pattern.test(body))) {
    logSecurityEvent('suspicious_request', {
      clientId,
      path,
      url: urlString,
      ip: clientIP,
      userAgent
    })
    
    return new NextResponse(
      JSON.stringify({ error: 'Request blocked' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
          ...securityHeaders
        }
      }
    )
  }

  // Log API requests for monitoring
  if (path.startsWith('/api/')) {
    logSecurityEvent('api_request', {
      clientId,
      path,
      method: request.method,
      ip: clientIP
    })
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public/).*)',
  ],
}
