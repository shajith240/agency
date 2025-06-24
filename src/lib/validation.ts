import { z } from 'zod'

// Contact form validation schema
export const contactFormSchema = z.object({
  businessName: z
    .string()
    .min(1, 'Business name is required')
    .max(100, 'Business name must be less than 100 characters')
    .regex(/^[a-zA-Z0-9\s\-&.,()]+$/, 'Business name contains invalid characters'),
  
  contactName: z
    .string()
    .min(1, 'Contact name is required')
    .max(50, 'Contact name must be less than 50 characters')
    .regex(/^[a-zA-Z\s\-']+$/, 'Contact name contains invalid characters'),
  
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(254, 'Email must be less than 254 characters'),
  
  phone: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true // Optional field
      return /^[\+]?[1-9][\d]{0,15}$/.test(val.replace(/[\s\-\(\)]/g, ''))
    }, 'Please enter a valid phone number'),
  
  industry: z
    .string()
    .min(1, 'Industry is required')
    .refine((val) => [
      'ecommerce', 'saas', 'healthcare', 'finance', 'real-estate', 
      'manufacturing', 'consulting', 'other'
    ].includes(val), 'Please select a valid industry'),
  
  currentProcesses: z
    .string()
    .min(10, 'Please provide at least 10 characters describing your processes')
    .max(2000, 'Description must be less than 2000 characters'),
  
  budgetRange: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true
      return ['under-5k', '5k-15k', '15k-50k', '50k-plus', 'discuss'].includes(val)
    }, 'Please select a valid budget range'),
  
  contactMethod: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true
      return ['email', 'phone', 'video', 'in-person'].includes(val)
    }, 'Please select a valid contact method'),
  
  projectDescription: z
    .string()
    .optional()
    .refine((val) => {
      if (!val) return true
      return val.length <= 2000
    }, 'Project description must be less than 2000 characters')
})

export type ContactFormData = z.infer<typeof contactFormSchema>

// Generic validation function
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): {
  success: boolean
  data?: T
  errors?: Record<string, string[]>
} {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string[]> = {}
      error.errors.forEach((err) => {
        const pathKey = err.path.join('.')
        if (!errors[pathKey]) {
          errors[pathKey] = []
        }
        errors[pathKey].push(err.message)
      })
      return { success: false, errors }
    }
    return { success: false, errors: { general: ['Validation failed'] } }
  }
}

// Rate limiting validation
export const rateLimitSchema = z.object({
  identifier: z.string().min(1),
  limit: z.number().positive(),
  window: z.number().positive()
})

// Environment validation
export const envSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().min(1),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  NEXT_PUBLIC_APP_URL: z.string().url(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional()
})
