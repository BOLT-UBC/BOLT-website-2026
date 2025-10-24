import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { profileService } from '@/lib/database'

// Simple in-memory rate limiting (for production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>()

function checkRateLimit(identifier: string, limit: number = 10, windowMs: number = 60000): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }

  if (record.count >= limit) {
    return false
  }

  record.count++
  return true
}

// Validate file upload
function validateFile(file: File): { valid: boolean; error?: string } {
  // Check file type
  const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  if (!allowedTypes.includes(file.type)) {
    return { valid: false, error: 'Only PDF and Word documents are allowed' }
  }

  // Check file size (5MB limit)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (file.size > maxSize) {
    return { valid: false, error: 'File size must be less than 5MB' }
  }

  // Check file name
  if (file.name.length > 255) {
    return { valid: false, error: 'File name too long' }
  }

  // Check for suspicious file names
  const suspiciousPatterns = /[<>:"/\\|?*]|\.\.|script|javascript|vbscript/i
  if (suspiciousPatterns.test(file.name)) {
    return { valid: false, error: 'Invalid file name' }
  }

  return { valid: true }
}

// Get user's resume info from profile
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // Basic UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    const profile = await profileService.getById(userId)

    return NextResponse.json({
      success: true,
      data: {
        resume_url: profile.resume_url,
        resume_file_name: profile.resume_file_name,
        resume_uploaded_at: profile.resume_uploaded_at
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to fetch resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Upload or update resume
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const userId = formData.get('userId') as string
    const file = formData.get('file') as File

    if (!userId || !file) {
      return NextResponse.json(
        { error: 'User ID and file are required' },
        { status: 400 }
      )
    }

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(`upload:${clientIP}`, 5, 60000)) { // 5 uploads per minute
      return NextResponse.json(
        { error: 'Too many upload attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    // File validation
    const fileValidation = validateFile(file)
    if (!fileValidation.valid) {
      return NextResponse.json(
        { error: fileValidation.error },
        { status: 400 }
      )
    }

    // Check if user is allowed to upload resume (not admin)
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', userId)
      .single()

    if (profileError) throw profileError

    if (profile?.role === 'admin') {
      return NextResponse.json(
        { error: 'Admins cannot upload resumes' },
        { status: 403 }
      )
    }

    // Upload file to Supabase Storage with secure naming
    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_')
    const fileName = `${userId}/${Date.now()}-${sanitizedFileName}`

    const { error: uploadError } = await supabase.storage
      .from('bolt-resumes-2025')
      .upload(fileName, file)

    if (uploadError) throw uploadError

    // Get public URL
    const { data: urlData } = supabase.storage
      .from('bolt-resumes-2025')
      .getPublicUrl(fileName)

    // Update profile with resume info
    const updatedProfile = await profileService.update(userId, {
      resume_url: urlData.publicUrl,
      resume_file_name: file.name,
      resume_uploaded_at: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      data: {
        resume_url: updatedProfile.resume_url,
        resume_file_name: updatedProfile.resume_file_name,
        resume_uploaded_at: updatedProfile.resume_uploaded_at
      }
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to upload resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

// Delete resume
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const userId = searchParams.get('userId')

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    // UUID validation
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    if (!uuidRegex.test(userId)) {
      return NextResponse.json(
        { error: 'Invalid user ID format' },
        { status: 400 }
      )
    }

    // Rate limiting
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    if (!checkRateLimit(`delete:${clientIP}`, 10, 60000)) { // 10 deletions per minute
      return NextResponse.json(
        { error: 'Too many delete attempts. Please try again later.' },
        { status: 429 }
      )
    }

    // Clear resume info from profile
    const updatedProfile = await profileService.update(userId, {
      resume_url: null,
      resume_file_name: null,
      resume_uploaded_at: null
    })

    return NextResponse.json({
      success: true,
      message: 'Resume deleted successfully',
      data: updatedProfile
    })
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to delete resume', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}
