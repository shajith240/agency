'use client'

import { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Mail, Calendar, Send, MessageSquare, AlertCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { contactFormSchema, validateInput, type ContactFormData } from "@/lib/validation"
import { sanitizeText, sanitizeEmail, sanitizePhone, checkRateLimit, logSecurityEvent } from "@/lib/security"

// Helper component for form fields with validation
function FormField({
  id,
  label,
  type = 'text',
  value,
  onChange,
  required = false,
  error,
  placeholder,
  className = ''
}: {
  id: string
  label: string
  type?: string
  value: string
  onChange: (value: string) => void
  required?: boolean
  error?: string[]
  placeholder?: string
  className?: string
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id} className="text-neutral-300">
        {label} {required && '*'}
      </Label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`bg-neutral-900/50 border-neutral-700 text-white ${
          error ? 'border-red-500 focus:border-red-500' : ''
        } ${className}`}
        required={required}
        placeholder={placeholder}
        aria-invalid={!!error}
        aria-describedby={error ? `${id}-error` : undefined}
      />
      {error && (
        <div id={`${id}-error`} className="flex items-center gap-1 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4" />
          {error[0]}
        </div>
      )}
    </div>
  )
}

export function ContactSection() {
  const [formData, setFormData] = useState<ContactFormData>({
    businessName: '',
    contactName: '',
    email: '',
    phone: '',
    industry: '',
    currentProcesses: '',
    budgetRange: '',
    contactMethod: '',
    projectDescription: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [validationErrors, setValidationErrors] = useState<Record<string, string[]>>({})
  const [rateLimited, setRateLimited] = useState(false)
  const [csrfToken, setCsrfToken] = useState<string>('')

  // Fetch CSRF token on component mount
  useEffect(() => {
    const fetchCSRFToken = async () => {
      try {
        const response = await fetch('/api/contact', { method: 'GET' })
        if (response.ok) {
          const data = await response.json()
          setCsrfToken(data.csrfToken)
        }
      } catch (error) {
        console.warn('Failed to fetch CSRF token:', error)
      }
    }

    fetchCSRFToken()
  }, [])

  const handleInputChange = (field: keyof ContactFormData, value: string) => {
    // Clear validation errors for this field
    if (validationErrors[field]) {
      setValidationErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    // Sanitize input based on field type
    let sanitizedValue = value
    switch (field) {
      case 'email':
        sanitizedValue = sanitizeEmail(value)
        break
      case 'phone':
        sanitizedValue = sanitizePhone(value)
        break
      case 'businessName':
      case 'contactName':
      case 'currentProcesses':
      case 'projectDescription':
        sanitizedValue = sanitizeText(value)
        break
      default:
        sanitizedValue = sanitizeText(value)
    }

    setFormData(prev => ({ ...prev, [field]: sanitizedValue }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Clear previous errors
    setValidationErrors({})

    // Rate limiting check
    const clientId = typeof window !== 'undefined' ?
      window.navigator.userAgent + window.location.hostname : 'server'
    const rateCheck = checkRateLimit(clientId, 3, 60000) // 3 requests per minute

    if (!rateCheck.allowed) {
      setRateLimited(true)
      toast.error('Too many requests. Please wait before submitting again.')
      logSecurityEvent('rate_limit_exceeded', { clientId, formType: 'contact' })
      return
    }

    // Validate form data
    const validation = validateInput(contactFormSchema, formData)

    if (!validation.success) {
      setValidationErrors(validation.errors || {})
      toast.error('Please fix the errors below and try again.')
      logSecurityEvent('form_validation_failed', { errors: validation.errors })
      return
    }

    setIsSubmitting(true)

    try {
      // Log form submission attempt
      logSecurityEvent('form_submission_attempt', {
        formType: 'contact',
        email: formData.email,
        businessName: formData.businessName
      })

      // Submit through secure API route
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-Token': csrfToken,
        },
        body: JSON.stringify(validation.data),
      })

      if (response.ok) {
        await response.json() // Parse response but don't use it
        toast.success('Thank you! We\'ll be in touch within 24 hours.')
        logSecurityEvent('form_submission_success', {
          formType: 'contact',
          email: formData.email
        })

        // Reset form
        setFormData({
          businessName: '',
          contactName: '',
          email: '',
          phone: '',
          industry: '',
          currentProcesses: '',
          budgetRange: '',
          contactMethod: '',
          projectDescription: ''
        })
        setIsModalOpen(false)
      } else {
        const errorData = await response.json().catch(() => ({}))

        if (response.status === 429) {
          setRateLimited(true)
          toast.error('Too many requests. Please wait before trying again.')
        } else if (response.status === 400 && errorData.details) {
          setValidationErrors(errorData.details)
          toast.error('Please fix the errors below and try again.')
        } else {
          throw new Error(errorData.message || `Form submission failed with status: ${response.status}`)
        }
      }
    } catch (error) {
      logSecurityEvent('form_submission_error', {
        error: error instanceof Error ? error.message : 'Unknown error',
        formType: 'contact'
      })
      toast.error('Something went wrong. Please try again or email us directly.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" className="pt-8 md:pt-16 pb-16 md:pb-32 bg-black/[0.96] relative w-full overflow-hidden">
      {/* Enhanced ambient background lighting following design system */}
      <div className="absolute inset-0 ambient-gradient-overlay opacity-60" />
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-br from-yellow-400/5 via-orange-500/4 to-transparent rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-gradient-to-tl from-red-500/4 via-orange-500/3 to-transparent rounded-full blur-3xl" />

      <div className="container mx-auto space-y-12 relative z-10">
        {/* Centered Content Layout */}
        <div className="flex flex-col items-center text-center max-w-4xl mx-auto">
          {/* Headline */}
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 leading-tight">
              Ready to Transform Your Business?
            </h2>
          </div>

          {/* Description */}
          <div className="mb-12">
            <p className="text-lg md:text-xl text-neutral-300 leading-relaxed max-w-3xl">
              Get a free consultation to discover how AI automation can streamline your operations,
              reduce costs, and boost productivity. Our experts will design a custom solution for your business.
            </p>
          </div>

          {/* Action Buttons - Following 8px grid spacing */}
          <div className="flex flex-col sm:flex-row gap-6 lg:gap-8">
            <Button
              size="lg"
              className="text-white hover:text-white font-semibold text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 transition-all duration-300 border-2 border-orange-500/70 hover:border-orange-500 backdrop-blur-sm bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 shadow-lg hover:shadow-xl ring-1 ring-white/20 hover:ring-white/30 brand-glow-hover hover:scale-105 active:scale-95"
              asChild
            >
              <Link href="https://calendly.com/sharpflow" target="_blank">
                <Calendar className="mr-3 w-5 h-5" />
                Book Free Call
              </Link>
            </Button>

            <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
              <DialogTrigger asChild>
                <Button
                  size="lg"
                  className="text-white hover:text-white font-semibold text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 transition-all duration-300 border-2 border-white/30 hover:border-orange-500/60 backdrop-blur-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-orange-500/20 hover:to-red-500/30 shadow-sm hover:shadow-md brand-glow-hover hover:scale-105 active:scale-95"
                >
                  <MessageSquare className="mr-3 w-5 h-5" />
                  Get Started
                </Button>
              </DialogTrigger>

              {/* Modal Content - Contact Form */}
              <DialogContent className="bg-black/95 border border-neutral-800/50 backdrop-blur-sm max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="text-2xl font-semibold text-white mb-2">Get Your Custom Quote</DialogTitle>
                  <p className="text-neutral-400">Tell us about your business and automation needs</p>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6 mt-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      id="businessName"
                      label="Business Name"
                      value={formData.businessName}
                      onChange={(value) => handleInputChange('businessName', value)}
                      required
                      error={validationErrors.businessName}
                    />
                    <FormField
                      id="contactName"
                      label="Contact Name"
                      value={formData.contactName}
                      onChange={(value) => handleInputChange('contactName', value)}
                      required
                      error={validationErrors.contactName}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      id="email"
                      label="Email"
                      type="email"
                      value={formData.email}
                      onChange={(value) => handleInputChange('email', value)}
                      required
                      error={validationErrors.email}
                    />
                    <FormField
                      id="phone"
                      label="Phone"
                      type="tel"
                      value={formData.phone || ''}
                      onChange={(value) => handleInputChange('phone', value)}
                      error={validationErrors.phone}
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="industry" className="text-neutral-300">Industry *</Label>
                      <Select value={formData.industry} onValueChange={(value) => handleInputChange('industry', value)}>
                        <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                          <SelectValue placeholder="Select your industry" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-neutral-700">
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="saas">SaaS</SelectItem>
                          <SelectItem value="healthcare">Healthcare</SelectItem>
                          <SelectItem value="finance">Finance</SelectItem>
                          <SelectItem value="real-estate">Real Estate</SelectItem>
                          <SelectItem value="manufacturing">Manufacturing</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="budgetRange" className="text-neutral-300">Budget Range</Label>
                      <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange('budgetRange', value)}>
                        <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                          <SelectValue placeholder="Select budget range" />
                        </SelectTrigger>
                        <SelectContent className="bg-neutral-900 border-neutral-700">
                          <SelectItem value="under-5k">Under $5,000</SelectItem>
                          <SelectItem value="5k-15k">$5,000 - $15,000</SelectItem>
                          <SelectItem value="15k-50k">$15,000 - $50,000</SelectItem>
                          <SelectItem value="50k-plus">$50,000+</SelectItem>
                          <SelectItem value="discuss">Let&apos;s discuss</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="currentProcesses" className="text-neutral-300">Current Processes to Automate *</Label>
                    <Textarea
                      id="currentProcesses"
                      value={formData.currentProcesses}
                      onChange={(e) => handleInputChange('currentProcesses', e.target.value)}
                      placeholder="Describe the business processes you'd like to automate..."
                      className={`bg-neutral-900/50 border-neutral-700 text-white min-h-[100px] ${
                        validationErrors.currentProcesses ? 'border-red-500 focus:border-red-500' : ''
                      }`}
                      required
                      aria-invalid={!!validationErrors.currentProcesses}
                      aria-describedby={validationErrors.currentProcesses ? 'currentProcesses-error' : undefined}
                    />
                    {validationErrors.currentProcesses && (
                      <div id="currentProcesses-error" className="flex items-center gap-1 text-red-400 text-sm">
                        <AlertCircle className="w-4 h-4" />
                        {validationErrors.currentProcesses[0]}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="contactMethod" className="text-neutral-300">Preferred Contact Method</Label>
                    <Select value={formData.contactMethod} onValueChange={(value) => handleInputChange('contactMethod', value)}>
                      <SelectTrigger className="bg-neutral-900/50 border-neutral-700 text-white">
                        <SelectValue placeholder="How would you like us to contact you?" />
                      </SelectTrigger>
                      <SelectContent className="bg-neutral-900 border-neutral-700">
                        <SelectItem value="email">Email</SelectItem>
                        <SelectItem value="phone">Phone Call</SelectItem>
                        <SelectItem value="video">Video Call</SelectItem>
                        <SelectItem value="in-person">In-Person Meeting</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {rateLimited && (
                    <div className="flex items-center gap-2 p-3 bg-red-900/20 border border-red-500/30 rounded-md text-red-400 text-sm">
                      <AlertCircle className="w-4 h-4" />
                      Rate limit exceeded. Please wait before submitting again.
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={isSubmitting || rateLimited}
                    className="w-full text-white hover:text-white font-semibold text-lg py-6 transition-all duration-300 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 hover:from-yellow-300 hover:via-orange-400 hover:to-red-400 shadow-lg hover:shadow-xl hover:shadow-orange-500/25 border border-white/10 hover:border-white/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="mr-3 w-5 h-5" />
                        Get Free Consultation
                      </>
                    )}
                  </Button>
                </form>
              </DialogContent>
            </Dialog>

            <Button
              size="lg"
              variant="ghost"
              className="text-white hover:text-white font-semibold text-lg md:text-xl px-8 md:px-12 py-4 md:py-6 transition-all duration-300 border-2 border-white/30 hover:border-orange-500/60 backdrop-blur-sm bg-gradient-to-r from-white/5 to-white/10 hover:from-orange-500/20 hover:to-red-500/30 shadow-sm hover:shadow-md brand-glow-hover hover:scale-105 active:scale-95"
              asChild
            >
              <Link href="mailto:contact@sharpflow.ai">
                <Mail className="mr-3 w-5 h-5" />
                Send Email
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}
