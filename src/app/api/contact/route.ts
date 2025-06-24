import { NextRequest, NextResponse } from 'next/server'
import { contactFormSchema, validateInput } from '@/lib/validation'
import { sanitizeText, sanitizeEmail, sanitizePhone, logSecurityEvent, generateCSRFToken } from '@/lib/security'

export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const body = await request.json()
    
    // Get client info for logging
    const clientIP = request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'
    
    // Validate input
    const validation = validateInput(contactFormSchema, body)
    
    if (!validation.success) {
      logSecurityEvent('contact_form_validation_failed', {
        errors: validation.errors,
        ip: clientIP
      })
      
      return NextResponse.json(
        { 
          error: 'Validation failed', 
          details: validation.errors 
        },
        { status: 400 }
      )
    }

    const validatedData = validation.data!

    // Additional sanitization (defense in depth)
    const sanitizedData = {
      businessName: sanitizeText(validatedData.businessName),
      contactName: sanitizeText(validatedData.contactName),
      email: sanitizeEmail(validatedData.email),
      phone: validatedData.phone ? sanitizePhone(validatedData.phone) : '',
      industry: sanitizeText(validatedData.industry),
      currentProcesses: sanitizeText(validatedData.currentProcesses),
      budgetRange: validatedData.budgetRange || '',
      contactMethod: validatedData.contactMethod || '',
      projectDescription: validatedData.projectDescription ? sanitizeText(validatedData.projectDescription) : ''
    }

    // Log successful validation
    logSecurityEvent('contact_form_validated', {
      email: sanitizedData.email,
      businessName: sanitizedData.businessName,
      ip: clientIP
    })

    // Submit to Formspree
    const formspreeResponse = await fetch('https://formspree.io/f/xpwzgqpb', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...sanitizedData,
        _subject: `New Automation Inquiry from ${sanitizedData.businessName}`,
        _replyto: sanitizedData.email,
        _format: 'plain'
      })
    })

    if (!formspreeResponse.ok) {
      throw new Error(`Formspree error: ${formspreeResponse.status}`)
    }

    // Log successful submission
    logSecurityEvent('contact_form_submitted', {
      email: sanitizedData.email,
      businessName: sanitizedData.businessName,
      ip: clientIP
    })

    return NextResponse.json(
      { 
        success: true, 
        message: 'Form submitted successfully' 
      },
      { status: 200 }
    )

  } catch (error) {
    logSecurityEvent('contact_form_error', {
      error: error instanceof Error ? error.message : 'Unknown error',
      ip: request.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown'
    })

    return NextResponse.json(
      { 
        error: 'Internal server error',
        message: 'Please try again later or contact us directly'
      },
      { status: 500 }
    )
  }
}

// Generate CSRF token
export async function GET() {
  const token = generateCSRFToken()
  
  return NextResponse.json(
    { csrfToken: token },
    { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
        'Pragma': 'no-cache'
      }
    }
  )
}

// Only allow POST and GET methods
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Allow': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization'
    }
  })
}
