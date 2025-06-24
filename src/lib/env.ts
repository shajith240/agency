import { z } from 'zod'

// Environment validation schema
const envSchema = z.object({
  // Required environment variables
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1, 'Supabase service role key is required'),
  NEXT_PUBLIC_APP_URL: z.string().url('Invalid app URL'),
  
  // Optional environment variables
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  
  // Security keys
  CSRF_SECRET: z.string().min(32, 'CSRF secret must be at least 32 characters').optional(),
  RATE_LIMIT_SECRET: z.string().optional(),
  
  // Monitoring
  SENTRY_DSN: z.string().url().optional().or(z.literal('')),
  LOG_LEVEL: z.enum(['debug', 'info', 'warn', 'error']).default('info'),
  
  // Email configuration
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().regex(/^\d+$/).transform(Number).optional(),
  SMTP_USER: z.string().email().optional(),
  SMTP_PASS: z.string().optional(),
  
  // Environment
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development')
})

// Validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      throw new Error(`Environment validation failed:\n${missingVars.join('\n')}`)
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()

// Type-safe environment access
export type Env = z.infer<typeof envSchema>

// Helper functions for environment checks
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'

// Security helpers
export function requireSecureContext() {
  if (isProduction && !env.NEXT_PUBLIC_APP_URL.startsWith('https://')) {
    throw new Error('HTTPS is required in production')
  }
}

export function getSecureHeaders() {
  const headers: Record<string, string> = {
    'X-Content-Type-Options': 'nosniff',
    'X-Frame-Options': 'DENY',
    'X-XSS-Protection': '1; mode=block',
    'Referrer-Policy': 'strict-origin-when-cross-origin'
  }
  
  if (isProduction) {
    headers['Strict-Transport-Security'] = 'max-age=31536000; includeSubDomains; preload'
  }
  
  return headers
}

// Validate required secrets for security features
export function validateSecuritySecrets() {
  const errors: string[] = []
  
  if (isProduction) {
    if (!env.CSRF_SECRET) {
      errors.push('CSRF_SECRET is required in production')
    }
    
    if (!env.NEXT_PUBLIC_APP_URL.startsWith('https://')) {
      errors.push('HTTPS is required in production (NEXT_PUBLIC_APP_URL must start with https://)')
    }
  }
  
  if (errors.length > 0) {
    throw new Error(`Security validation failed:\n${errors.join('\n')}`)
  }
}

// Initialize environment validation
try {
  validateSecuritySecrets()
} catch (error) {
  if (isProduction) {
    throw error
  } else {
    console.warn('Security validation warning:', error)
  }
}
